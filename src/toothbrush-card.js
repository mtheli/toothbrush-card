import { LitElement, html, css, unsafeCSS } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ToothSVG } from './toothbrush-svg.js';
import { MODE_ICONS, CONN_ICONS } from './icons.js';
import { t } from './translations.js';
import styles from 'bundle-text:./toothbrush-card.css';

export const CARD_VERSION = "0.15.0";

const BRUSHING_DURATION = 120; // 2 minutes target

// Integration domain -> translation_key of the main state entity the card
// binds to. A device is supported iff it carries that entity — exactly the
// condition under which the card can render it, and one that sub-devices
// (e.g. the Sonicare Brush Head/Connection) never meet. Drives both the
// editor's device picker and getStubConfig; new integrations only need a
// line here plus their entity mapping in _findAndMapEntitiesInConfig.
export const SUPPORTED_INTEGRATIONS = {
    oralb: 'toothbrush_state',
    philips_sonicare_ble: 'handle_state',
};

export const QUADRANT_ZONES = ['lower_left', 'lower_right', 'upper_left', 'upper_right'];
export const SEXTANT_ZONES = ['lower_left', 'lower_front', 'lower_right', 'upper_right', 'upper_front', 'upper_left'];

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

        // retry entity discovery until base_entity is found
        if ((!this._entityIds || !this._entityIds.base_entity) && this.config?.device_id) {
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
        // Completion latch (issue #4): persist the finished-session view.
        this._peakDuration = 0;
        this._completed = false;
        this._completedDuration = 0;
        this._wasActiveSession = false;
        this._sessionRoutineLength = 0;
        this._completedAt = 0;
        this._holdDismissed = false;
    }

    // --- Held-session persistence (issue #4/#5 follow-up) ---
    // The completion latch survives page reloads via localStorage: Oral-B
    // brushes wipe their reported session data ~seconds after powering off,
    // so after a reload there is often nothing left to re-derive from the
    // sensors. Stored per device, cleared when the next session starts.

    _holdStorageKey(deviceId) {
        return `toothbrush-card-hold-${deviceId}`;
    }

    _loadHeldSession(deviceId) {
        try {
            const raw = localStorage.getItem(this._holdStorageKey(deviceId));
            const held = raw ? JSON.parse(raw) : null;
            if (!held) return null;
            // A dismissed marker (X on the badge) suppresses re-deriving the
            // same session from frozen sensor values until a new one starts.
            if (held.dismissed) return { dismissed: true };
            return held.completedAt > 0 && held.duration > 0 ? held : null;
        } catch (e) {
            return null;
        }
    }

    _dismissHold() {
        this._completed = false;
        this._completedAt = 0;
        this._completedDuration = 0;
        this._holdDismissed = true;
        const deviceId = this.config?.device_id;
        if (deviceId) {
            try {
                localStorage.setItem(
                    this._holdStorageKey(deviceId),
                    JSON.stringify({ dismissed: true })
                );
            } catch (e) { /* ignore */ }
        }
        this.requestUpdate();
    }

    _saveHeldSession(deviceId, completedAt, duration) {
        try {
            localStorage.setItem(
                this._holdStorageKey(deviceId),
                JSON.stringify({ completedAt, duration })
            );
        } catch (e) { /* storage full/blocked — hold just won't survive reloads */ }
    }

    _clearHeldSession(deviceId) {
        try {
            localStorage.removeItem(this._holdStorageKey(deviceId));
        } catch (e) { /* ignore */ }
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
        const deviceChanged = this.config?.device_id !== config.device_id;
        this.config = config;
        if (deviceChanged) {
            // Remap entities and drop the previous device's session state so a
            // held recap from device A never renders for device B; then adopt
            // device B's own persisted hold, if any.
            this._entityIds = null;
            this._peakDuration = 0;
            this._wasActiveSession = false;
            this._sessionRoutineLength = 0;
            const held = this._loadHeldSession(config.device_id);
            this._holdDismissed = !!held?.dismissed;
            this._completed = !!held && !held.dismissed;
            this._completedDuration = this._completed ? held.duration : 0;
            this._completedAt = this._completed ? held.completedAt : 0;
        }
        if (this._hass && !this._entityIds) {
            this._entityIds = this._findAndMapEntitiesInConfig(this._hass, config.device_id);
        }
    }

    getCardSize() {
        return 5;
    }

    /**
     * Inline style for the <ha-card>, exposing the accent color plus the
     * optional tooth/active/done color overrides (issue #6). Colors left
     * unset fall back to the CSS defaults.
     */
    _cardStyle() {
        const c = this.config || {};
        let style = `--accent-color: ${c.accent_color || '#FFFFFF'}`;
        if (c.tooth_color) style += `; --tb-tooth-color: ${c.tooth_color}`;
        if (c.active_color) style += `; --tb-active-color: ${c.active_color}`;
        if (c.done_color) style += `; --tb-done-color: ${c.done_color}`;
        return style;
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

    _trackVisitedSector(rawIndex, active) {
        if (!active) {
            this._visitedSectors = null;
            return 0;
        }
        if (!this._visitedSectors) this._visitedSectors = new Set();
        if (rawIndex >= 0) this._visitedSectors.add(rawIndex);
        return this._visitedSectors.size;
    }

    _parseRawSectorIndex(sector) {
        const match = String(sector).match(/(\d+)/);
        if (match) {
            const idx = parseInt(match[1]) - 1;
            return idx >= 0 ? idx : -1;
        }
        return -1;
    }

    _getSectorData(sector, activeIndex, sectorOrder, doneCount = null) {
        const sectorClassMaps = {};
        sectorOrder.forEach(s => { sectorClassMaps[s] = { done: false, brushing: false }; });

        if (sector === 'success') {
            sectorOrder.forEach(s => { sectorClassMaps[s].done = true; });
            return sectorClassMaps;
        }

        if (activeIndex === -1 || activeIndex >= sectorOrder.length) {
            return sectorClassMaps;
        }

        // Time-based doneCount (Sonicare-Pfad) erlaubt Revisits ohne Done-Reset;
        // Fallback ist index-basiertes Progress-Marking (Oral-B).
        const effectiveDone = doneCount !== null
            ? Math.max(doneCount, activeIndex)
            : activeIndex;

        sectorOrder.forEach((sectorName, index) => {
            if (index === activeIndex) {
                sectorClassMaps[sectorName].brushing = true;
            } else if (index < effectiveDone) {
                sectorClassMaps[sectorName].done = true;
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
        if (p === 'normal' || p === 'medium') return 'p-normal';
        return '';
    }

    _getPressureColor(pressure) {
        const p = String(pressure).toLowerCase();
        if (p === 'high') return 'red';
        if (p === 'low') return 'amber';
        if (p === 'normal' || p === 'medium') return 'green';
        return '';
    }

    _isActive(status) {
        return status === 'running' || status === 'run';
    }

    /**
     * Searching for all needed entities.
     */
    _findAndMapEntitiesInConfig(hass, deviceId) {
        const entityKeys = {
            sector: null, duration: null, mode: null, pressure: null,
            battery: null, status: null, base_entity: null,
            number_of_sectors: null, model_number: null,
            routine_length: null, integration: null,
            brushhead_wear: null, activity: null,
            mode_select: null, esp_bridge_alive: null,
            ble_connected: null
        };

        const allEntities = hass.entities;

        for (const entityId in allEntities) {
            const entity = allEntities[entityId];
            if (entity.device_id !== deviceId) continue;

            if (!entityKeys.integration && entity.platform) {
                entityKeys.integration = entity.platform;
            }

            const state = hass.states[entityId];
            const deviceClass = state?.attributes?.device_class;

            // Shared translation_keys (OralB + Sonicare >= 0.8)
            if (entity.translation_key === 'sector') {
                entityKeys.sector = entity.entity_id;
            } else if (entity.translation_key === 'number_of_sectors') {
                entityKeys.number_of_sectors = entity.entity_id;
            } else if (entity.translation_key === 'mode') {
                entityKeys.mode = entity.entity_id;
            } else if (entity.translation_key === 'pressure') {
                entityKeys.pressure = entity.entity_id;
            } else if (entity.translation_key === 'toothbrush_state') {
                entityKeys.status = entity.entity_id;
            }

            // Sonicare translation_keys
            if (entity.translation_key === 'handle_state') {
                entityKeys.status = entity.entity_id;
            } else if (entity.translation_key === 'brushing_mode') {
                entityKeys.mode = entity.entity_id;
            } else if (entity.translation_key === 'pressure_alert') {
                entityKeys.pressure = entity.entity_id;
            } else if (entity.translation_key === 'intensity') {
                if (!entityKeys.pressure) entityKeys.pressure = entity.entity_id;
            } else if (entity.translation_key === 'model_number') {
                entityKeys.model_number = entity.entity_id;
            } else if (entity.translation_key === 'activity') {
                entityKeys.activity = entity.entity_id;
            } else if (entity.translation_key === 'brushing_time') {
                entityKeys.duration = entity.entity_id;
            } else if (entity.translation_key === 'brushing_mode_select') {
                entityKeys.mode_select = entity.entity_id;
            } else if (entity.translation_key === 'esp_bridge_alive') {
                entityKeys.esp_bridge_alive = entity.entity_id;
            } else if (entity.translation_key === 'routine_length') {
                entityKeys.routine_length = entity.entity_id;
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

        // Search related devices (child + same config entry) for additional entities
        if (hass.devices) {
            const mainDevice = hass.devices[deviceId];
            const configEntries = mainDevice?.config_entries || [];
            const relatedDevices = Object.values(hass.devices).filter(d =>
                d.id !== deviceId && (
                    d.via_device_id === deviceId ||
                    d.config_entries?.some(ce => configEntries.includes(ce))
                )
            );
            for (const related of relatedDevices) {
                for (const entityId in allEntities) {
                    const entity = allEntities[entityId];
                    if (entity.device_id !== related.id) continue;
                    if (entity.translation_key === 'brushhead_wear') {
                        entityKeys.brushhead_wear = entity.entity_id;
                    } else if (entity.translation_key === 'esp_bridge_alive') {
                        entityKeys.esp_bridge_alive = entity.entity_id;
                    } else if (entity.translation_key === 'ble_connected') {
                        entityKeys.ble_connected = entity.entity_id;
                    }
                }
            }
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

        const entityIds = this._entityIds;
        const device = hass.devices[config.device_id];
        const deviceName = device.name;
        const manufacturer = device.manufacturer || '';
        const modelNumber = entityIds.model_number
            ? hass.states[entityIds.model_number]?.state || ''
            : '';
        const headerTitle = config.title || manufacturer || deviceName;
        const rawSub = config.show_subtitle !== false
            ? (modelNumber || deviceName)
            : '';
        const headerSub = rawSub && headerTitle && rawSub.startsWith(headerTitle)
            ? rawSub.slice(headerTitle.length).trim()
            : rawSub;

        // Read sensor states
        const numSectorsFromEntity = entityIds.number_of_sectors
            ? parseInt(hass.states[entityIds.number_of_sectors]?.state) || null
            : null;
        const numSectors = config.num_sectors || numSectorsFromEntity || 4;
        const duration = entityIds.duration ? parseInt(hass.states[entityIds.duration]?.state) || 0 : 0;
        const rawPressure = entityIds.pressure ? hass.states[entityIds.pressure]?.state || 'N/A' : 'N/A';
        const pressure = rawPressure === 'unavailable' || rawPressure === 'unknown'
            ? '–'
            : rawPressure === 'on' ? 'high' : rawPressure === 'off' ? 'normal' : rawPressure;
        const rawBattery = entityIds.battery ? hass.states[entityIds.battery]?.state : null;
        const batteryUnavailable = !rawBattery || rawBattery === 'unavailable' || rawBattery === 'unknown';
        const batteryLevel = batteryUnavailable ? 0 : rawBattery;
        const modeSelectState = entityIds.mode_select ? hass.states[entityIds.mode_select] : null;
        const mode = (modeSelectState?.state && modeSelectState.state !== 'unavailable')
            ? modeSelectState.state
            : (entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A');
        const routineLength = entityIds.routine_length
            ? parseInt(hass.states[entityIds.routine_length]?.state) || 0
            : 0;

        const brushheadWear = entityIds.brushhead_wear
            ? parseFloat(hass.states[entityIds.brushhead_wear]?.state) || null
            : null;

        const statusEntityId = entityIds.base_entity;
        const status = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';
        const active = this._isActive(status);

        // Completion latch (issues #4, #5): keep showing the finished session
        // after it ends. Neither integration keeps reporting a completed
        // session — Oral-B freezes its last advertised values once the brush
        // stops broadcasting (sleepy device, entities stay available) and
        // Sonicare powers itself off at the end — so the done state would
        // otherwise vanish moments after brushing or never appear. We track
        // the peak duration while active and, on the active->inactive
        // transition, latch "completed" if a full routine was reached. The
        // hold survives 'unavailable'/'unknown' and is released only when the
        // next session starts. Opt out with `hold_completed: false`.
        // The 0.9 tolerance covers Sonicare powering off a beat before the
        // last duration sample lands exactly on the routine length.
        const holdCompleted = config.hold_completed !== false;
        if (active) {
            if (!this._wasActiveSession) {
                // New session started — drop any held completion.
                this._peakDuration = 0;
                this._completed = false;
                this._completedAt = 0;
                this._holdDismissed = false;
                this._visitedSectors = null;
                this._sessionRoutineLength = 0;
                this._clearHeldSession(config.device_id);
            }
            this._peakDuration = Math.max(this._peakDuration, duration);
            if (routineLength > 0) {
                // Snapshot the routine governing THIS session; at the end the
                // routine_length sensor may already read unavailable (0).
                this._sessionRoutineLength = routineLength;
            }
        } else if (this._wasActiveSession) {
            // Session just ended — latch if (nearly) a full routine was reached.
            const endTarget = (this._sessionRoutineLength || BRUSHING_DURATION) * 0.9;
            this._completed = holdCompleted && this._peakDuration >= endTarget;
            this._completedDuration = this._peakDuration;
            this._peakDuration = 0;
            if (this._completed) {
                this._completedAt = Date.now();
                this._saveHeldSession(config.device_id, this._completedAt, this._completedDuration);
            }
        } else if (holdCompleted && !this._holdDismissed
                && (!entityIds.routine_length || routineLength > 0)
                && duration >= (routineLength || BRUSHING_DURATION) * 0.9) {
            // Issue #5: also derive completion from the current state alone —
            // the frozen post-session values prove a finished session even if
            // the card never observed the transition (dashboard closed while
            // brushing, or reloaded afterwards). Skipped while an existing
            // routine_length sensor is unreadable, so an aborted long routine
            // can't slip past the shorter default target. Math.max lets late
            // post-session samples refine the shown time but never lower it.
            // A timestamp restored from localStorage wins over the duration
            // sensor's last_changed (survives HA restarts re-stamping it).
            if (!this._completed) {
                this._completedAt = Date.parse(
                    hass.states[entityIds.duration]?.last_changed
                ) || Date.now();
            }
            this._completed = true;
            const refined = Math.max(this._completedDuration, duration);
            if (refined !== this._completedDuration) {
                this._completedDuration = refined;
                this._saveHeldSession(config.device_id, this._completedAt, refined);
            }
        }
        this._wasActiveSession = active;
        // hold_duration in hours; absent = 0.5 h default, explicit 0 = until
        // the next session. After expiry the recap is merely hidden — a later
        // setting change can re-show it.
        const holdHours = config.hold_duration !== undefined
            ? Number(config.hold_duration) || 0
            : 0.5;
        const holdExpired = holdHours > 0 && this._completedAt > 0
            && Date.now() - this._completedAt > holdHours * 3600000;
        const showCompleted = holdCompleted && this._completed && !active && !holdExpired;

        // Mode selector
        const canSelectMode = entityIds.mode_select
            && modeSelectState?.state !== 'unavailable'
            && !active;
        const modeOptions = canSelectMode
            ? (modeSelectState?.attributes?.options || [])
            : [];
        if (active && this._showModeDropdown) {
            this._showModeDropdown = false;
        }

        // ESP Bridge
        const espConnected = entityIds.esp_bridge_alive
            ? hass.states[entityIds.esp_bridge_alive]?.state === 'on'
            : false;

        // Sonicare: show initializing screen while connecting
        const activity = entityIds.activity ? hass.states[entityIds.activity]?.state : null;
        if (activity === 'initializing') {
            return html`
                <ha-card style="${this._cardStyle()}">
                    <div class="card-header">
                        <div class="header-title">
                            <div class="header-accent"></div>
                            <h2>${config.title || device.manufacturer || deviceName}</h2>
                            ${headerSub ? html`<span class="header-sub">${headerSub}</span>` : ''}
                        </div>
                        <div class="header-icons">
                            <svg class="conn-icon disconnected" viewBox="0 0 24 24" fill="currentColor">
                                <path d="${CONN_ICONS.bluetooth}"/>
                            </svg>
                            ${entityIds.esp_bridge_alive ? html`
                            <svg class="conn-icon ${espConnected ? '' : 'disconnected'}" viewBox="0 0 24 24" fill="currentColor"
                                 @click="${() => this._showMoreInfo(entityIds.esp_bridge_alive)}">
                                <path d="${espConnected ? CONN_ICONS.lan_connect : CONN_ICONS.lan_disconnect}"/>
                            </svg>` : ''}
                            <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                                 @click="${() => this._showDeviceInfo()}">
                                <circle cx="12" cy="5" r="1.5"/>
                                <circle cx="12" cy="12" r="1.5"/>
                                <circle cx="12" cy="19" r="1.5"/>
                            </svg>
                        </div>
                    </div>
                    <div class="init-wrap">
                        <div class="init-rings">
                            <div class="init-ring init-ring-1"></div>
                            <div class="init-ring init-ring-2"></div>
                            <div class="init-ring init-ring-3"></div>
                            <div class="init-bt">
                                <svg viewBox="0 0 24 24" fill="var(--primary-color, #3b82f6)">
                                    <path d="M14.5 12.5l4-4-5.5-5.5v8.5l-4-4-1.5 1.5 5 5-5 5 1.5 1.5 4-4v8.5l5.5-5.5z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="init-label">${t(hass, 'status_initializing')}</div>
                    </div>
                </ha-card>
            `;
        }

        // Sector: use real entity if available, otherwise compute from time
        let sector;
        if (entityIds.sector) {
            sector = hass.states[entityIds.sector]?.state || 'no_sector';
        } else if (routineLength > 0 && active && duration > 0) {
            const sectorDuration = routineLength / numSectors;
            // +1 because _parseRawSectorIndex expects 1-based values (OralB convention)
            const idx = Math.min(numSectors, Math.floor(duration / sectorDuration) + 1);
            sector = String(idx);
        } else if (routineLength > 0 && duration >= routineLength && duration > 0) {
            sector = 'success';
        } else {
            sector = 'no_sector';
        }

        // issue #4: while holding a finished session, present it as completed
        // (all zones done, final time) regardless of the now-idle live values.
        if (showCompleted) {
            sector = 'success';
        }
        const displayDuration = showCompleted ? this._completedDuration : duration;

        // Computed values
        const defaultOrder = numSectors === 6 ? SEXTANT_ZONES : QUADRANT_ZONES;
        const sectorOrder = config.sector_order?.length === numSectors
            ? config.sector_order
            : defaultOrder;
        const rawSectorIndex = this._parseRawSectorIndex(sector);
        // Sonicare meldet anatomische Sektoren inklusive Revisits (White+,
        // Gum Health) — dort den _correctSectorIndex-Workaround umgehen und
        // Done-Zonen zeit-basiert markieren, damit Revisits die bereits
        // abgeschlossenen Zonen nicht zurücksetzen. Oral-B braucht den
        // Workaround weiterhin (Integration meldet Sektor 5/6 als 4).
        const allowsRevisits = entityIds.integration === 'philips_sonicare_ble'
            && routineLength > 0;
        let correctedIndex;
        let doneCount = null;
        if (sector === 'success') {
            correctedIndex = -1;
        } else if (allowsRevisits) {
            correctedIndex = rawSectorIndex >= 0
                ? Math.min(rawSectorIndex, sectorOrder.length - 1)
                : -1;
            // doneCount kombiniert Zeit-Fortschritt und tatsächlich beobachtete
            // Sektoren. Wir nutzen das Maximum, damit nach einem Revisit (White+:
            // nach 120s alle Zonen einmal durch) die bereits besuchten Zonen
            // "done" bleiben, auch wenn der Raw-Sektor wieder zurückspringt.
            const timeBasedDone = Math.min(
                sectorOrder.length,
                Math.floor(sectorOrder.length * duration / routineLength)
            );
            const visitedSize = this._trackVisitedSector(rawSectorIndex, active);
            doneCount = Math.max(timeBasedDone, visitedSize);
        } else {
            correctedIndex = this._correctSectorIndex(rawSectorIndex, active, sectorOrder.length - 1);
        }
        const sectorClassData = this._getSectorData(sector, correctedIndex, sectorOrder, doneCount);
        const sectorLabel = this._getSectorLabel(sector, correctedIndex, sectorOrder);
        const isSuccess = sector === 'success';
        const batteryColor = batteryUnavailable ? 'muted' : this._getBatteryChipColor(batteryLevel);
        const batteryIsCharging = status === 'charging' || status === 'charge';
        const batteryIconName = batteryUnavailable ? 'mdi:battery-unknown' : this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const pressureColor = this._getPressureColor(pressure);
        const pressureClass = this._getPressureClass(pressure);
        const modeUnavailable = mode === 'unavailable' || mode === 'unknown' || mode === 'N/A';
        const modeIcon = modeUnavailable ? 'mdi:brush-variant' : this._getModeIcon(mode);
        const modeLabel = modeUnavailable ? '–' : this._getModeLabel(mode);
        const targetDuration = routineLength || BRUSHING_DURATION;
        const progressPct = showCompleted
            ? 100
            : Math.min(100, Math.round(displayDuration / targetDuration * 100));
        const statusKey = 'status_' + status;
        const displayStatus = t(hass, statusKey) !== statusKey
            ? t(hass, statusKey)
            : status.replace(/_/g, ' ');
        const pressureKey = 'pressure_' + String(pressure).toLowerCase();
        const displayPressure = t(hass, pressureKey) !== pressureKey
            ? t(hass, pressureKey)
            : pressure.replace(/_/g, ' ');
        const btConnected = entityIds.ble_connected
            ? hass.states[entityIds.ble_connected]?.state === 'on'
            : status !== 'unavailable' && status !== 'unknown';
        const btActive = active || batteryIsCharging;

        // Age line under the done badge ("2 h ago") — a held recap must not
        // read as a just-finished session the next morning. Ticks via the
        // existing 1 s interval.
        let completedAgo = '';
        if (showCompleted && this._completedAt > 0) {
            const mins = Math.floor((Date.now() - this._completedAt) / 60000);
            if (mins < 1) {
                completedAgo = t(hass, 'completed_just_now');
            } else if (mins < 60) {
                completedAgo = t(hass, 'completed_ago_minutes').replace('{n}', mins);
            } else {
                completedAgo = t(hass, 'completed_ago_hours').replace('{n}', Math.floor(mins / 60));
            }
        }

        return html`
            <ha-card style="${this._cardStyle()}">
                <!-- Header -->
                <div class="card-header">
                    <div class="header-title">
                        <div class="header-accent"></div>
                        <h2>${headerTitle}</h2>
                        ${headerSub ? html`<span class="header-sub">${headerSub}</span>` : ''}
                    </div>
                    <div class="header-icons">
                        <svg class="conn-icon ${btActive ? 'active' : ''} ${!btConnected ? 'disconnected' : ''}"
                             viewBox="0 0 24 24" fill="currentColor">
                            <path d="${CONN_ICONS.bluetooth}"/>
                        </svg>
                        ${entityIds.esp_bridge_alive ? html`
                        <svg class="conn-icon ${espConnected ? '' : 'disconnected'}" viewBox="0 0 24 24" fill="currentColor"
                             @click="${() => this._showMoreInfo(entityIds.esp_bridge_alive)}">
                            <path d="${espConnected ? CONN_ICONS.lan_connect : CONN_ICONS.lan_disconnect}"/>
                        </svg>` : ''}
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
                        <div class="chip-value ${batteryColor}">${batteryUnavailable ? '–' : html`${batteryLevel}%`}</div>
                    </div>

                    <div class="chip" @click="${() => this._showMoreInfo(entityIds.pressure)}">
                        <div class="pressure-bars ${pressureClass}">
                            <div class="pb"></div><div class="pb"></div>
                            <div class="pb"></div><div class="pb"></div>
                        </div>
                        <span class="chip-label">${t(hass, 'chip_pressure')}</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>

                    <div class="mode-chip-wrap">
                        <div class="chip ${canSelectMode ? 'selectable' : ''}"
                             @click="${() => this._handleModeChipClick()}">
                            <div class="chip-icon ${modeUnavailable ? 'muted' : 'blue'}">
                                <ha-icon icon="${modeIcon}"></ha-icon>
                            </div>
                            <span class="chip-label">${t(hass, 'chip_mode')}</span>
                            <div class="chip-value ${modeUnavailable ? '' : 'blue'}" style="font-size:12px;">${modeLabel}${canSelectMode ? html`<span class="mode-caret"> ▾</span>` : ''}</div>
                            ${canSelectMode ? html`<ha-icon class="chip-select-hint" icon="mdi:chevron-down"></ha-icon>` : ''}
                        </div>
                        ${this._showModeDropdown && canSelectMode ? html`
                            <div class="dropdown-backdrop" @click="${() => this._closeModeDropdown()}"></div>
                            <div class="mode-dropdown">
                                ${modeOptions.map(opt => html`
                                    <div class="mode-option ${opt === mode ? 'active' : ''}"
                                         @click="${(e) => { e.stopPropagation(); this._selectMode(opt); }}">
                                        <ha-icon icon="${this._getModeIcon(opt)}"></ha-icon>
                                        <span>${this._getModeLabel(opt)}</span>
                                    </div>
                                `)}
                            </div>
                        ` : ''}
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
                                ${this._formatTime(displayDuration)}
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
                            <span>${sectorLabel || ''}</span>
                            <span>${targetDuration > 0 ? html`${this._formatTime(displayDuration)} / ${this._formatTime(targetDuration)}` : ''}</span>
                            <span>${progressPct}%</span>
                        </div>
                    </div>

                    ${brushheadWear !== null ? html`
                        <div class="brushhead-indicator" @click="${() => this._showMoreInfo(entityIds.brushhead_wear)}">
                            <svg viewBox="0 0 24 72" class="brushhead-svg">
                                <defs>
                                    <clipPath id="bh-fill-${this._bhClipId}">
                                        <rect x="0" y="${brushheadWear * 0.72}" width="24" height="${72 - brushheadWear * 0.72}"/>
                                    </clipPath>
                                </defs>
                                <!-- Brush head: wide oval top, thin neck, narrow handle -->
                                <path d="M4,6 C4,2 7,0 12,0 C17,0 20,2 20,6 L20,22 C20,26 18,28 16,29 L16,31 C17,31.5 17.5,32 17.5,33 L17.5,34 C17.5,35 17,35.5 16,36 L16,64 C16,68 15,71 12,71 C9,71 8,68 8,64 L8,36 C7,35.5 6.5,35 6.5,34 L6.5,33 C6.5,32 7,31.5 8,31 L8,29 C6,28 4,26 4,22 Z" fill="none" stroke="var(--divider-color, #bbb)" stroke-width="1.2"/>
                                <!-- Fill -->
                                <path d="M4,6 C4,2 7,0 12,0 C17,0 20,2 20,6 L20,22 C20,26 18,28 16,29 L16,31 C17,31.5 17.5,32 17.5,33 L17.5,34 C17.5,35 17,35.5 16,36 L16,64 C16,68 15,71 12,71 C9,71 8,68 8,64 L8,36 C7,35.5 6.5,35 6.5,34 L6.5,33 C6.5,32 7,31.5 8,31 L8,29 C6,28 4,26 4,22 Z" fill="${this._getBrushheadColor(brushheadWear)}" opacity="0.3" clip-path="url(#bh-fill-${this._bhClipId})"/>
                                <!-- Bristle rows -->
                                <line x1="7" y1="5" x2="17" y2="5" stroke="var(--divider-color, #bbb)" stroke-width="0.7"/>
                                <line x1="6.5" y1="9" x2="17.5" y2="9" stroke="var(--divider-color, #bbb)" stroke-width="0.7"/>
                                <line x1="6" y1="13" x2="18" y2="13" stroke="var(--divider-color, #bbb)" stroke-width="0.7"/>
                                <line x1="6" y1="17" x2="18" y2="17" stroke="var(--divider-color, #bbb)" stroke-width="0.7"/>
                                <line x1="6.5" y1="21" x2="17.5" y2="21" stroke="var(--divider-color, #bbb)" stroke-width="0.7"/>
                            </svg>
                            <span class="brushhead-pct">${Math.round(100 - brushheadWear)}%</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Done badge -->
                <div class="done-badge ${isSuccess ? 'show' : ''}">
                    ${showCompleted ? html`
                    <button class="done-dismiss"
                            @click=${() => this._dismissHold()}>&times;</button>` : ''}
                    <p>&#10003; ${t(hass, 'done_title')}${completedAgo
                        ? html` <span class="done-age">(${completedAgo})</span>` : ''}</p>
                    <span>${t(hass, numSectors === 6 ? 'done_sextants' : 'done_quadrants')}</span>
                </div>
            </ha-card>
        `;
    }

    get _bhClipId() {
        if (!this.__bhClipId) this.__bhClipId = Math.random().toString(36).slice(2, 8);
        return this.__bhClipId;
    }

    _getBrushheadColor(wear) {
        if (wear >= 80) return '#ef4444';
        if (wear >= 60) return '#f59e0b';
        return '#22c55e';
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

    _handleModeChipClick() {
        const entityIds = this._entityIds;
        const hass = this._hass;
        if (!hass || !entityIds) return;

        const status = entityIds.base_entity ? hass.states[entityIds.base_entity]?.state : 'unknown';
        const active = this._isActive(status);
        const modeSelectState = entityIds.mode_select ? hass.states[entityIds.mode_select] : null;
        const canSelect = entityIds.mode_select
            && modeSelectState?.state !== 'unavailable'
            && !active;

        if (canSelect) {
            this._showModeDropdown = !this._showModeDropdown;
            this.requestUpdate();
        } else {
            this._showMoreInfo(entityIds.mode || entityIds.mode_select);
        }
    }

    _closeModeDropdown() {
        this._showModeDropdown = false;
        this.requestUpdate();
    }

    async _selectMode(option) {
        this._showModeDropdown = false;
        this.requestUpdate();
        await this._hass.callService('select', 'select_option', {
            entity_id: this._entityIds.mode_select,
            option: option
        });
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
            (e) => e.translation_key && SUPPORTED_INTEGRATIONS[e.platform] === e.translation_key
        );
        return { device_id: entry ? entry.device_id : "" };
    }
}
