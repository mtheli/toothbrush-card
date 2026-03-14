import { LitElement, html, css, unsafeCSS } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ToothSVG } from './toothbrush-svg.js';
import { MODE_ICONS } from './icons.js';
import { t } from './translations.js';
import styles from 'bundle-text:./toothbrush-card.css';

export const CARD_VERSION = "0.6.0";

const BRUSHING_DURATION = 120; // 2 minutes target

export const QUADRANT_ZONES = ['lower_left', 'lower_right', 'upper_left', 'upper_right'];
export const SEXTANT_ZONES = ['upper_right', 'upper_front', 'upper_left', 'lower_left', 'lower_front', 'lower_right'];

export const ACCENT_COLORS = [
    { name: 'Blue',         color: '#0085FF' },
    { name: 'Light Blue',   color: '#AEF0FF' },
    { name: 'Turquoise',    color: '#4CEAC8' },
    { name: 'Light Green',  color: '#CBF68F' },
    { name: 'Yellow',       color: '#FFDC00' },
    { name: 'Orange',       color: '#FF782C' },
    { name: 'Pink',         color: '#F825BB' },
    { name: 'Purple',       color: '#7036CF' },
    { name: 'Light Purple', color: '#D9C1FF' },
    { name: 'White',        color: '#FFFFFF' },
];


export class ToothbrushCard extends LitElement {

    set hass(hass) {
        this._hass = hass;

        // retry entity discovery until sector entity is found
        if ((!this._entityIds || !this._entityIds.sector) && this.config?.device_id) {
            this._entityIds = this._findAndMapEntitiesInConfig(hass, this.config.device_id);
        }

        this.requestUpdate();
    }

    get hass() {
        return this._hass;
    }

    constructor() {
        super();
        this._highestSector = -1;
        this._lastRawIndex = -1;
        this._correctedIndex = -1;
        this._wasActive = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this._interval) {
            this._interval = setInterval(() => this.requestUpdate(), 1000);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    setConfig(config) {
        if (!config.device_id) {
            throw new Error('Please enter the device id');
        }
        this.config = config;
        if (this._hass && !this._entityIds) {
            this._entityIds = this._findAndMapEntitiesInConfig(this._hass, config.device_id);
        }
    }

    getCardSize() {
        return 5;
    }

    _showMoreInfo(entityId = null) {
        const targetEntityId = entityId || this._entityIds?.base_entity;
        if (!this._hass || !targetEntityId) return;

        this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: { entityId: targetEntityId }
        }));
    }

    _showDeviceInfo() {
        if (!this.config?.device_id) return;
        history.pushState(null, '', `/config/devices/device/${this.config.device_id}`);
        window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
    }

    /**
     * Workaround for oralb_ble mapping bug: 6-sector brushes wrap back to
     * sector 4 instead of reporting sectors 5/6. During active brushing
     * sectors only move forward, so if we see a sector ≤ the highest
     * already seen, we advance to the next one instead.
     */
    _correctSectorIndex(rawIndex, active, maxIndex) {
        if (!this._wasActive && active) {
            this._highestSector = -1;
            this._lastRawIndex = -1;
            this._correctedIndex = -1;
        }
        this._wasActive = active;

        if (!active || rawIndex === -1) {
            this._highestSector = -1;
            this._lastRawIndex = -1;
            this._correctedIndex = -1;
            return rawIndex;
        }

        // Same raw value as last render — return cached result
        if (rawIndex === this._lastRawIndex) {
            return this._correctedIndex;
        }

        this._lastRawIndex = rawIndex;

        if (rawIndex > this._highestSector) {
            this._highestSector = rawIndex;
            this._correctedIndex = rawIndex;
        } else {
            // Sector went backwards or repeated — advance
            const corrected = Math.min(this._highestSector + 1, maxIndex);
            this._highestSector = corrected;
            this._correctedIndex = corrected;
        }

        return this._correctedIndex;
    }

    _parseRawSectorIndex(sector) {
        const match = String(sector).match(/(\d+)/);
        if (match) {
            const idx = parseInt(match[1]) - 1;
            return idx >= 0 ? idx : -1;
        }
        return -1;
    }

    _getSectorData(sector, activeIndex, sectorOrder) {
        const sectorClassMaps = {};
        sectorOrder.forEach(s => { sectorClassMaps[s] = { done: false, brushing: false }; });

        if (sector === 'success') {
            sectorOrder.forEach(s => { sectorClassMaps[s].done = true; });
            return sectorClassMaps;
        }

        if (activeIndex === -1 || activeIndex >= sectorOrder.length) {
            return sectorClassMaps;
        }

        sectorOrder.forEach((sectorName, index) => {
            if (index < activeIndex) {
                sectorClassMaps[sectorName].done = true;
            } else if (index === activeIndex) {
                sectorClassMaps[sectorName].brushing = true;
            }
        });

        return sectorClassMaps;
    }

    _getSectorLabel(sector, activeIndex, sectorOrder) {
        if (sector === 'success') return t(this._hass, 'complete');
        if (activeIndex >= 0 && activeIndex < sectorOrder.length) {
            return t(this._hass, 'zone_' + sectorOrder[activeIndex]);
        }
        return '';
    }

    _getBatteryChipColor(level) {
        const l = parseInt(level, 10);
        if (l <= 15) return 'red';
        if (l <= 30) return 'amber';
        return 'green';
    }

    _getPressureClass(pressure) {
        const p = String(pressure).toLowerCase();
        if (p === 'high') return 'p-high';
        if (p === 'low') return 'p-low';
        return 'p-normal';
    }

    _getPressureColor(pressure) {
        const p = String(pressure).toLowerCase();
        if (p === 'high') return 'red';
        if (p === 'low') return 'amber';
        if (p === 'normal') return 'green';
        return 'blue';
    }

    _isActive(status) {
        return status === 'running';
    }

    /**
     * Searching for all needed entities.
     */
    _findAndMapEntitiesInConfig(hass, deviceId) {
        const entityKeys = {
            sector: null, duration: null, mode: null, pressure: null,
            battery: null, status: null, base_entity: null,
            number_of_sectors: null
        };

        const allEntities = hass.entities;

        for (const entityId in allEntities) {
            const entity = allEntities[entityId];
            if (entity.device_id !== deviceId) continue;

            const state = hass.states[entityId];
            const deviceClass = state?.attributes?.device_class;

            if (entity.translation_key === 'sector') {
                entityKeys.sector = entity.entity_id;
            } else if (entity.translation_key === 'mode') {
                entityKeys.mode = entity.entity_id;
            } else if (entity.translation_key === 'pressure') {
                entityKeys.pressure = entity.entity_id;
            } else if (entity.translation_key === 'toothbrush_state') {
                entityKeys.status = entity.entity_id;
            } else if (entity.translation_key === 'number_of_sectors') {
                entityKeys.number_of_sectors = entity.entity_id;
            }

            if (deviceClass) {
                if (entityKeys.battery === null && deviceClass === 'battery') {
                    entityKeys.battery = entity.entity_id;
                } else if (entityKeys.duration === null && deviceClass === 'duration') {
                    entityKeys.duration = entity.entity_id;
                }
            }

            if (entityKeys.status === null && entityKeys.base_entity === null) {
                if (!entity.entity_id.includes('_') || entity.entity_id.endsWith(deviceId)) {
                    entityKeys.base_entity = entity.entity_id;
                }
            }
        }

        if (entityKeys.status !== null) {
            entityKeys.base_entity = entityKeys.status;
            entityKeys.status = null;
        }

        return entityKeys;
    }

    render() {
        const hass = this._hass;
        const config = this.config;

        if (!hass || !config || !this._entityIds) {
            if (hass && config?.device_id) {
                this._entityIds = this._findAndMapEntitiesInConfig(hass, config.device_id);
            } else {
                throw new Error('Please enter the device id');
            }
        }

        const device = hass.devices[config.device_id];
        const deviceName = device.name;
        const manufacturer = device.manufacturer || '';
        const headerTitle = config.title || manufacturer || deviceName;
        const headerSub = config.show_subtitle !== false ? deviceName : '';

        const entityIds = this._entityIds;

        // Read sensor states
        const numSectors = entityIds.number_of_sectors
            ? parseInt(hass.states[entityIds.number_of_sectors]?.state) || 4
            : 4;
        const sector = entityIds.sector ? hass.states[entityIds.sector]?.state || 'no_sector' : 'no_sector';
        const duration = entityIds.duration ? parseInt(hass.states[entityIds.duration]?.state) || 0 : 0;
        const pressure = entityIds.pressure ? hass.states[entityIds.pressure]?.state || 'N/A' : 'N/A';
        const batteryLevel = entityIds.battery ? hass.states[entityIds.battery]?.state || 0 : 0;
        const mode = entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A';

        const statusEntityId = entityIds.base_entity;
        const status = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';

        // Computed values
        const defaultOrder = numSectors === 6 ? SEXTANT_ZONES : QUADRANT_ZONES;
        const sectorOrder = config.sector_order?.length === numSectors
            ? config.sector_order
            : defaultOrder;
        const active = this._isActive(status);
        const rawSectorIndex = this._parseRawSectorIndex(sector);
        const correctedIndex = sector === 'success' ? -1
            : this._correctSectorIndex(rawSectorIndex, active, sectorOrder.length - 1);
        const sectorClassData = this._getSectorData(sector, correctedIndex, sectorOrder);
        const sectorLabel = this._getSectorLabel(sector, correctedIndex, sectorOrder);
        const isSuccess = sector === 'success';
        const batteryColor = this._getBatteryChipColor(batteryLevel);
        const batteryIsCharging = status === 'charging';
        const batteryIconName = this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const pressureColor = this._getPressureColor(pressure);
        const pressureClass = this._getPressureClass(pressure);
        const modeIcon = this._getModeIcon(mode);
        const modeLabel = this._getModeLabel(mode);
        const progressPct = Math.min(100, Math.round(duration / BRUSHING_DURATION * 100));
        const statusKey = 'status_' + status;
        const displayStatus = t(hass, statusKey) !== statusKey
            ? t(hass, statusKey)
            : status.replace(/_/g, ' ');
        const pressureKey = 'pressure_' + String(pressure).toLowerCase();
        const displayPressure = t(hass, pressureKey) !== pressureKey
            ? t(hass, pressureKey)
            : pressure.replace(/_/g, ' ');
        const btConnected = status !== 'unavailable' && status !== 'unknown';
        const btActive = active || status === 'charging';
        const accentColor = config.accent_color || '#FFFFFF';

        return html`
            <ha-card style="--accent-color: ${accentColor}">
                <!-- Header -->
                <div class="card-header">
                    <div class="header-title">
                        <div class="header-accent"></div>
                        <h2>${headerTitle}</h2>
                        ${headerSub ? html`<span class="header-sub">${headerSub}</span>` : ''}
                    </div>
                    <div class="header-icons">
                        <svg class="bt-icon ${btActive ? 'bt-active' : ''} ${!btConnected ? 'bt-off' : ''}"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
                            ${!btConnected ? html`<line x1="4" y1="4" x2="20" y2="20" stroke-width="2.5"/>` : ''}
                        </svg>
                        <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                             @click="${() => this._showDeviceInfo()}">
                            <circle cx="12" cy="5" r="1.5"/>
                            <circle cx="12" cy="12" r="1.5"/>
                            <circle cx="12" cy="19" r="1.5"/>
                        </svg>
                    </div>
                </div>

                <!-- Chips: Battery / Pressure / Mode -->
                <div class="chips-row">
                    <div class="chip" @click="${() => this._showMoreInfo(entityIds.battery)}">
                        <div class="chip-icon ${batteryColor}">
                            <ha-icon icon="${batteryIconName}"></ha-icon>
                        </div>
                        <span class="chip-label">${t(hass, 'chip_battery')}</span>
                        <div class="chip-value ${batteryColor}">${batteryLevel}%</div>
                    </div>

                    <div class="chip" @click="${() => this._showMoreInfo(entityIds.pressure)}">
                        <div class="pressure-bars ${pressureClass}">
                            <div class="pb"></div><div class="pb"></div>
                            <div class="pb"></div><div class="pb"></div>
                        </div>
                        <span class="chip-label">${t(hass, 'chip_pressure')}</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>

                    <div class="chip" @click="${() => this._showMoreInfo(entityIds.mode)}">
                        <div class="chip-icon blue">
                            <ha-icon icon="${modeIcon}"></ha-icon>
                        </div>
                        <span class="chip-label">${t(hass, 'chip_mode')}</span>
                        <div class="chip-value blue" style="font-size:12px;">${modeLabel}</div>
                    </div>
                </div>

                <!-- Tooth visual -->
                <div class="visual-area">
                    <div class="tooth-wrap">
                        ${ToothSVG(sectorClassData, numSectors)}
                        <div class="center-info">
                            <span class="session-label">${t(hass, 'session')}</span>
                            <div class="timer-display ${active ? 'active' : ''}"
                                 @click="${() => this._showMoreInfo(entityIds.duration)}">
                                ${this._formatTime(duration)}
                            </div>
                        </div>
                    </div>

                    <div class="status-text-wrap" @click="${() => this._showMoreInfo(entityIds.base_entity)}">
                        <div class="status-main ${active ? 'active' : ''}">${displayStatus}</div>
                        ${sectorLabel ? html`<div class="status-sub">${sectorLabel}</div>` : ''}
                    </div>

                    <div class="progress-wrap ${active || isSuccess ? 'visible' : ''}">
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${progressPct}%"></div>
                        </div>
                        <div class="progress-labels">
                            <span>${sectorLabel || '—'}</span>
                            <span>${progressPct}%</span>
                        </div>
                    </div>
                </div>

                <!-- Done badge -->
                <div class="done-badge ${isSuccess ? 'show' : ''}">
                    <p>&#10003; ${t(hass, 'done_title')}</p>
                    <span>${t(hass, numSectors === 6 ? 'done_sextants' : 'done_quadrants')}</span>
                </div>
            </ha-card>
        `;
    }

    _getBatteryColor(level) {
        if (level <= 15) return 'red';
        if (level <= 30) return 'orange';
        return 'var(--paper-item-icon-color)';
    }

    _getBatteryIcon(level, is_charging) {
        const batteryLevel = parseInt(level, 10);
        if (is_charging === true) return 'mdi:battery-charging';
        if (batteryLevel <= 5) return 'mdi:battery-alert-variant-outline';

        const roundedLevel = Math.min(100, Math.ceil(batteryLevel / 10) * 10);
        if (roundedLevel === 0) return 'mdi:battery-outline';
        if (roundedLevel === 100) return 'mdi:battery';
        return `mdi:battery-${roundedLevel}`;
    }

    _getModeIcon(mode) {
        const cleanMode = String(mode).toLowerCase().replace(/ /g, '_');
        return MODE_ICONS[cleanMode] || MODE_ICONS.default;
    }

    _getModeLabel(mode) {
        const cleanMode = String(mode).toLowerCase().replace(/ /g, '_');
        const key = 'mode_' + cleanMode;
        const translated = t(this._hass, key);
        return translated !== key ? translated : mode.replace(/_/g, ' ');
    }

    _formatTime(seconds) {
        const secs = parseInt(seconds);
        if (isNaN(secs) || secs < 0) return '0:00';

        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    static get styles() {
        return unsafeCSS(styles);
    }

    static getConfigElement() {
        return document.createElement('toothbrush-card-editor');
    }

    static getStubConfig(hass) {
        const entry = Object.values(hass.entities).find(
            (e) => e.platform === "oralb" && e.translation_key === "toothbrush_state"
        );
        return { device_id: entry ? entry.device_id : "" };
    }
}
