import { LitElement, html, css, unsafeCSS } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ToothSVG } from './toothbrush-svg.js';
import { MODE_ICONS, MODE_LABELS } from './icons.js';
import styles from 'bundle-text:./toothbrush-card.css';

export const CARD_VERSION = "0.2.0";

const BRUSHING_DURATION = 120; // 2 minutes target

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

    _getSectorData(sector) {
        const allSectors = ['lower_left', 'lower_right', 'upper_left', 'upper_right'];

        const getActiveIndex = (input) => {
            switch (input) {
                case 'sector_1': case 'sector 1': case '1': return 0;
                case 'sector_2': case 'sector 2': case '2': return 1;
                case 'sector_3': case 'sector 3': case '3': return 2;
                case 'sector_4': case 'sector 4': case '4': return 3;
                default: return -1;
            }
        };

        const activeIndex = getActiveIndex(sector);

        const sectorClassMaps = {
            lower_left:  { done: false, brushing: false },
            lower_right: { done: false, brushing: false },
            upper_left:  { done: false, brushing: false },
            upper_right: { done: false, brushing: false }
        };

        if (sector === 'success') {
            allSectors.forEach(s => { sectorClassMaps[s].done = true; });
            return sectorClassMaps;
        }

        if (activeIndex === -1) {
            return sectorClassMaps;
        }

        allSectors.forEach((sectorName, index) => {
            if (index < activeIndex) {
                sectorClassMaps[sectorName].done = true;
            } else if (index === activeIndex) {
                sectorClassMaps[sectorName].brushing = true;
            }
        });

        return sectorClassMaps;
    }

    _getSectorLabel(sector) {
        switch (sector) {
            case 'sector_1': case 'sector 1': case '1': return 'Lower left';
            case 'sector_2': case 'sector 2': case '2': return 'Lower right';
            case 'sector_3': case 'sector 3': case '3': return 'Upper left';
            case 'sector_4': case 'sector 4': case '4': return 'Upper right';
            case 'success': return 'Complete';
            default: return '';
        }
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
            battery: null, status: null, base_entity: null
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
        const sector = entityIds.sector ? hass.states[entityIds.sector]?.state || 'no_sector' : 'no_sector';
        const duration = entityIds.duration ? parseInt(hass.states[entityIds.duration]?.state) || 0 : 0;
        const pressure = entityIds.pressure ? hass.states[entityIds.pressure]?.state || 'N/A' : 'N/A';
        const batteryLevel = entityIds.battery ? hass.states[entityIds.battery]?.state || 0 : 0;
        const mode = entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A';

        const statusEntityId = entityIds.base_entity;
        const status = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';

        // Computed values
        const active = this._isActive(status);
        const sectorClassData = this._getSectorData(sector);
        const sectorLabel = this._getSectorLabel(sector);
        const isSuccess = sector === 'success';
        const batteryColor = this._getBatteryChipColor(batteryLevel);
        const batteryIsCharging = status === 'charging';
        const batteryIconName = this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const pressureColor = this._getPressureColor(pressure);
        const pressureClass = this._getPressureClass(pressure);
        const modeIcon = this._getModeIcon(mode);
        const modeLabel = this._getModeLabel(mode);
        const progressPct = Math.min(100, Math.round(duration / BRUSHING_DURATION * 100));
        const displayStatus = status.replace(/_/g, ' ');
        const displayPressure = pressure.replace(/_/g, ' ');
        const btConnected = status !== 'unavailable' && status !== 'unknown';
        const btActive = active || status === 'charging';

        return html`
            <ha-card>
                <!-- Header -->
                <div class="card-header">
                    <div class="header-title">
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
                        <span class="chip-label">Battery</span>
                        <div class="chip-value ${batteryColor}">${batteryLevel}%</div>
                    </div>

                    <div class="chip" @click="${() => this._showMoreInfo(entityIds.pressure)}">
                        <div class="pressure-bars ${pressureClass}">
                            <div class="pb"></div><div class="pb"></div>
                            <div class="pb"></div><div class="pb"></div>
                        </div>
                        <span class="chip-label">Pressure</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>

                    <div class="chip" @click="${() => this._showMoreInfo(entityIds.mode)}">
                        <div class="chip-icon blue">
                            <ha-icon icon="${modeIcon}"></ha-icon>
                        </div>
                        <span class="chip-label">Mode</span>
                        <div class="chip-value blue" style="font-size:12px;">${modeLabel}</div>
                    </div>
                </div>

                <!-- Tooth visual -->
                <div class="visual-area">
                    <div class="tooth-wrap">
                        ${ToothSVG(sectorClassData)}
                        <div class="center-info">
                            <span class="session-label">Session</span>
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
                    <p>&#10003; Brushing complete!</p>
                    <span>All 4 quadrants finished</span>
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
        return MODE_LABELS[cleanMode] || mode.replace(/_/g, ' ');
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

    static getConfigForm() {
        return {
            schema: [
                {
                    name: "title",
                    label: "Title (Optional)",
                    selector: { text: {} }
                },
                {
                    name: "show_subtitle",
                    label: "Show device name as subtitle",
                    selector: { boolean: {} },
                    default: true
                },
                {
                    name: "device_id",
                    required: true,
                    selector: {
                        device: {
                            filter: { integration: "oralb" },
                            multiple: false
                        }
                    }
                }
            ]
        };
    }

    static getStubConfig(hass) {
        const entry = Object.values(hass.entities).find(
            (e) => e.platform === "oralb" && e.translation_key === "toothbrush_state"
        );
        return { device_id: entry ? entry.device_id : "" };
    }
}
