import { LitElement, html, css, unsafeCSS } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ToothSVG } from './toothbrush-svg.js';
import { MODE_ICONS, CONN_ICONS } from './icons.js';
import { t } from './translations.js';
import styles from 'bundle-text:./toothbrush-card.css';

export const CARD_VERSION = "0.21.0";

const BRUSHING_DURATION = 120; // 2 minutes target

// Integration domain -> matcher for the main state entity the card binds to.
// A device is supported iff it carries that entity — exactly the condition
// under which the card can render it, and one that sub-devices (e.g. the
// Sonicare Brush Head/Connection) never meet. Drives both the editor's
// device picker and getStubConfig; new integrations only need a line here
// plus their entity mapping in findDeviceEntities. Most integrations are
// matched by translation_key; xiaomi_ble names its entities library-side
// (no translation_key), so its main entity is recognized by entity_id
// suffix instead (entity_ids are language-independent).
export const SUPPORTED_INTEGRATIONS = {
    oralb: { translationKey: 'toothbrush_state' },
    philips_sonicare_ble: { translationKey: 'handle_state' },
    xiaomi_ble: { idSuffix: '_toothbrush' },
};

// True when this entity is the main state entity of a supported integration.
export function isMainStateEntity(entity) {
    const m = SUPPORTED_INTEGRATIONS[entity.platform];
    if (!m) return false;
    if (m.translationKey) return entity.translation_key === m.translationKey;
    return entity.entity_id.endsWith(m.idSuffix);
}

// Progress-bar gradient endpoints (blue → green across the full track).
// The track is sliced into one sub-bar per sector, so each sub-bar gets
// its slice of this gradient instead of restarting it per segment.
const PROGRESS_GRADIENT_FROM = [0x3b, 0x82, 0xf6];
const PROGRESS_GRADIENT_TO = [0x16, 0xa3, 0x4a];

function progressColorAt(fraction) {
    const c = PROGRESS_GRADIENT_FROM.map((v, i) =>
        Math.round(v + (PROGRESS_GRADIENT_TO[i] - v) * fraction));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}

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

// Placeable readings and the four corner slots — shared by the card renderer
// and the editor so both agree on what can go where.
export const LAYOUT_PROPS = ['battery', 'pressure', 'intensity', 'mode', 'score', 'brush_head'];
export const CORNER_SLOTS = ['top_left', 'top_right', 'bottom_left', 'bottom_right'];

/**
 * Contact-feedback is exposed as either pressure or intensity, never both, and
 * which one a handle reports isn't known until a device is selected. The stored
 * layout uses a neutral `pressure` token by default; here we swap it to the one
 * the device actually provides (and vice-versa), then drop any duplicate the
 * swap may create, so the card and editor agree on the concrete reading.
 */
export function resolveLayoutForDevice(layout, ids) {
    if (!ids) return layout;
    const hasPressure = !!(ids.pressure_state || ids.pressure);
    const hasIntensity = !!ids.intensity;
    // Devices with neither contact feedback nor a mode reading (e.g. Xiaomi)
    // would render a lone battery chip under the classic default; give them a
    // battery/score/brush-head row instead. Only the untouched default is
    // rewritten — an explicit layout is respected as-is.
    if (layout.defaulted && !hasPressure && !hasIntensity
        && !ids.mode && !ids.mode_select && ids.score) {
        return { chips: ['battery', 'score', 'brush_head'], corners: {} };
    }
    // Only the neutral default 'pressure' is rewritten, and only for handles
    // that have intensity but no pressure — an explicit choice is left intact so
    // a device exposing both can carry either (or both).
    const swap = (p) => {
        if (p === 'pressure' && !hasPressure && hasIntensity) return 'intensity';
        return p;
    };
    const seen = new Set();
    const keep = (p) => {
        const q = swap(p);
        if (seen.has(q)) return null;
        seen.add(q);
        return q;
    };
    const chips = layout.chips.map(keep).filter(Boolean);
    const corners = {};
    for (const [k, v] of Object.entries(layout.corners)) {
        const q = keep(v);
        if (q) corners[k] = q;
    }
    return { chips, corners };
}

/**
 * Resolve the configurable property placement. Without `layout:` the card keeps
 * its historical arrangement, so existing dashboards render unchanged. A
 * property may appear once across chips and corners (first occurrence wins) and
 * the chip row is capped at three.
 */
export function normalizeLayout(config) {
    const raw = config?.layout;
    if (!raw || typeof raw !== 'object') {
        // `defaulted` lets resolveLayoutForDevice swap in a device-appropriate
        // default without ever touching an explicitly configured layout.
        return { chips: ['battery', 'pressure', 'mode'], corners: { top_right: 'brush_head' }, defaulted: true };
    }
    const seen = new Set();
    const take = (p) => {
        if (!LAYOUT_PROPS.includes(p) || seen.has(p)) return false;
        seen.add(p);
        return true;
    };
    const chips = [];
    if (Array.isArray(raw.chips)) {
        for (const p of raw.chips) {
            if (chips.length >= 3) break;
            if (take(p)) chips.push(p);
        }
    }
    const corners = {};
    for (const pos of CORNER_SLOTS) {
        const p = raw.corners?.[pos];
        if (p && take(p)) corners[pos] = p;
    }
    return { chips, corners };
}

/**
 * Map a device's entities to the card's logical readings. Pure (no card
 * instance needed) so the editor can share it to decide which readings a
 * device actually provides.
 */
export function findDeviceEntities(hass, deviceId) {
    const entityKeys = {
        sector: null, duration: null, mode: null, pressure: null,
        pressure_state: null, intensity: null,
        battery: null, status: null, base_entity: null,
        number_of_sectors: null, model_number: null,
        routine_length: null, integration: null,
        brushhead_wear: null, activity: null,
        mode_select: null, esp_bridge_alive: null,
        ble_connected: null, score: null
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

        // xiaomi_ble: the library names entities itself (no translation_key),
        // so readings are matched by entity_id suffix. The broadcast carries
        // no live duration or sectors — those are synthesized from time.
        if (entity.platform === 'xiaomi_ble') {
            if (entity.entity_id.endsWith('_toothbrush')) {
                entityKeys.status = entity.entity_id;
            } else if (entity.entity_id.endsWith('_score')) {
                entityKeys.score = entity.entity_id;
            } else if (entity.entity_id.endsWith('_consumable')) {
                // Xiaomi reports the percentage LEFT on the head; the card
                // tracks wear, so the reading is inverted where it's used.
                entityKeys.brushhead_wear = entity.entity_id;
                entityKeys.brushhead_remaining = true;
            }
        }

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
        } else if (entity.translation_key === 'pressure_state') {
            // Categorical pressure state (ok / optimal / too_high). Kept
            // separate so it can take precedence over the raw grams
            // 'pressure' sensor and the 'intensity' fallback regardless of
            // entity iteration order.
            entityKeys.pressure_state = entity.entity_id;
        } else if (entity.translation_key === 'intensity') {
            entityKeys.intensity = entity.entity_id;
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

    _getIntensityIcon(intensity) {
        // Graded speedometer, matching the integration's intensity control.
        const v = String(intensity).toLowerCase();
        if (v === 'high') return 'mdi:speedometer';
        if (v === 'low') return 'mdi:speedometer-slow';
        return 'mdi:speedometer-medium';
    }

    _getIntensityColor(intensity) {
        // Own, non-alarming level scale — intensity is a chosen setting, so a
        // high level must never read as a warning (unlike pressure's red).
        const v = String(intensity).toLowerCase();
        if (v === 'high') return 'int-high';
        if (v === 'medium') return 'int-med';
        if (v === 'low') return 'int-low';
        return 'muted';
    }

    _normalizeLayout(config) {
        return normalizeLayout(config);
    }

    _isActive(status) {
        return status === 'running' || status === 'run';
    }

    /**
     * Searching for all needed entities.
     */
    _findAndMapEntitiesInConfig(hass, deviceId) {
        return findDeviceEntities(hass, deviceId);
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
        const statusEntityId = entityIds.base_entity;
        const rawStatus = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';
        // Binary main state entities (xiaomi_ble) report plain on/off.
        const status = rawStatus === 'on' ? 'running' : rawStatus === 'off' ? 'idle' : rawStatus;
        const active = this._isActive(status);
        // Without a duration entity (Xiaomi broadcasts no live timer) the
        // session time is how long the state entity has been on — the card's
        // 1s refresh keeps it ticking.
        const duration = entityIds.duration
            ? parseInt(hass.states[entityIds.duration]?.state) || 0
            : (active && statusEntityId && hass.states[statusEntityId]?.last_changed
                ? Math.max(0, Math.floor((Date.now() - new Date(hass.states[statusEntityId].last_changed).getTime()) / 1000))
                : 0);
        // Pressure and intensity are distinct readings (a handle reports one or
        // the other): pressure is contact feedback with an ok/too-high reading,
        // intensity is a user-set power level. Each has its own chip, colours
        // and icon and is placed independently in the layout.
        const pressureEntity = entityIds.pressure_state || entityIds.pressure;
        const rawPressure = pressureEntity ? hass.states[pressureEntity]?.state || 'N/A' : 'N/A';
        const pressure = rawPressure === 'unavailable' || rawPressure === 'unknown'
            ? '–'
            : rawPressure === 'on' || rawPressure === 'too_high' ? 'high'
            : rawPressure === 'off' || rawPressure === 'ok' || rawPressure === 'optimal' ? 'normal'
            : rawPressure;
        const intensityEntity = entityIds.intensity;
        const rawIntensity = intensityEntity ? hass.states[intensityEntity]?.state || 'N/A' : 'N/A';
        const intensity = rawIntensity === 'unavailable' || rawIntensity === 'unknown' || rawIntensity === 'N/A'
            ? '–'
            : rawIntensity;
        const rawBattery = entityIds.battery ? hass.states[entityIds.battery]?.state : null;
        const batteryUnavailable = !rawBattery || rawBattery === 'unavailable' || rawBattery === 'unknown';
        const batteryLevel = batteryUnavailable ? 0 : rawBattery;
        const modeSelectState = entityIds.mode_select ? hass.states[entityIds.mode_select] : null;
        const mode = (modeSelectState?.state && modeSelectState.state !== 'unavailable')
            ? modeSelectState.state
            : (entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A');
        // Routine length: config override first, then the entity; synthetic-
        // timer devices (no duration entity) fall back to the 2-minute default
        // so the time-based sector path can run.
        const routineLength = Number(config.routine_length)
            || (entityIds.routine_length
                ? parseInt(hass.states[entityIds.routine_length]?.state) || 0
                : 0)
            || (entityIds.duration ? 0 : BRUSHING_DURATION);

        // A brand-new head legitimately reports 0.0 wear (issue #12), so only
        // a non-numeric state (unavailable/unknown) hides the reading.
        const brushheadWearRaw = entityIds.brushhead_wear
            ? parseFloat(hass.states[entityIds.brushhead_wear]?.state)
            : NaN;
        let brushheadWear = Number.isFinite(brushheadWearRaw) ? brushheadWearRaw : null;
        // xiaomi_ble reports percentage left; the card tracks wear.
        if (brushheadWear !== null && entityIds.brushhead_remaining) {
            brushheadWear = 100 - brushheadWear;
        }

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
            // can't slip past the shorter default target.
            // Issue #11: the hold restored from localStorage may belong to an
            // OLDER session. A reading that differs from the held duration is
            // a newer session (or a late tail sample of it — brush_time still
            // ticks up for a few seconds after the end), so adopt its
            // timestamp and value, downwards too. An identical reading is the
            // same session: an HA restart restores the exact value but
            // re-stamps last_changed, so there the held timestamp wins.
            if (!this._completed || duration !== this._completedDuration) {
                this._completedAt = Date.parse(
                    hass.states[entityIds.duration]?.last_changed
                ) || Date.now();
                this._completedDuration = duration;
                this._saveHeldSession(config.device_id, this._completedAt, duration);
            }
            this._completed = true;
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
                    ${config.show_header === false ? '' : html`
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
                    </div>`}
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
        const intensityIcon = this._getIntensityIcon(intensity);
        const intensityColor = this._getIntensityColor(intensity);
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
        const intensityKey = 'intensity_' + String(intensity).toLowerCase();
        const displayIntensity = t(hass, intensityKey) !== intensityKey
            ? t(hass, intensityKey)
            : intensity.replace(/_/g, ' ');
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

        // ---- Configurable property placement (chips + corners) ----
        const layout = resolveLayoutForDevice(this._normalizeLayout(config), entityIds);
        const POS_CLASS = { top_left: 'tl', top_right: 'tr', bottom_left: 'bl', bottom_right: 'br' };
        const brushheadPct = brushheadWear !== null ? Math.round(100 - brushheadWear) : null;
        const scoreState = entityIds.score ? hass.states[entityIds.score]?.state : null;
        const scoreAvailable = scoreState && scoreState !== 'unavailable' && scoreState !== 'unknown';
        // Star shape and colour both step with the score so the icon still
        // reads in the compact icon-only layout (non-numeric scores keep the
        // neutral full gold star).
        const scoreNum = parseFloat(scoreState);
        const scoreTier = !scoreAvailable || isNaN(scoreNum) || scoreNum >= 85 ? 2
            : scoreNum >= 60 ? 1 : 0;
        const scoreIcon = ['mdi:star-outline', 'mdi:star-half-full', 'mdi:star'][scoreTier];
        const scoreColor = ['red', 'amber', 'gold'][scoreTier];

        // Shared brush-head glyph (chip icon and corner marker): the head
        // capsule in side view — bristles sticking out sideways, the typical
        // Sonicare silhouette. The fill steps in quarters instead of tracking
        // the exact percentage: at icon size a continuous fill is unreadable,
        // discrete jumps are not.
        const bhSteps = brushheadPct > 75 ? 4 : brushheadPct > 50 ? 3 : brushheadPct > 25 ? 2 : 1;
        const bhClipY = 30 - bhSteps * 7.5;
        const bhColor = this._getBrushheadColor(brushheadWear);
        const bhFillHex = { green: '#16a34a', amber: '#d97706', red: '#dc2626' }[bhColor];
        const headSvg = () => html`
            <svg viewBox="0 0 24 30" class="brushhead-svg">
                <defs>
                    <clipPath id="bh-fill-${this._bhClipId}">
                        <rect x="0" y="${bhClipY}" width="24" height="${30 - bhClipY}"/>
                    </clipPath>
                </defs>
                <path d="M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z" fill="none" stroke="var(--secondary-text-color, #888)" stroke-width="2"/>
                <path d="M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z" fill="${bhFillHex}" opacity="0.8" clip-path="url(#bh-fill-${this._bhClipId})"/>
                <line x1="10.5" y1="4" x2="3" y2="4" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="8" x2="2.5" y2="8" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="12" x2="3" y2="12" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="16" x2="4.5" y2="16" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
            </svg>`;

        // A property rendered as a full chip. Returns '' when the reading is
        // absent on this device, so the slot collapses instead of showing '–'.
        const chipEl = (prop) => {
            switch (prop) {
                case 'battery':
                    if (!entityIds.battery) return '';
                    return html`<div class="chip" @click="${() => this._showMoreInfo(entityIds.battery)}">
                        <div class="chip-icon ${batteryColor}"><ha-icon icon="${batteryIconName}"></ha-icon></div>
                        <span class="chip-label">${t(hass, 'chip_battery')}</span>
                        <div class="chip-value ${batteryColor}">${batteryUnavailable ? '–' : html`${batteryLevel}%`}</div>
                    </div>`;
                case 'pressure':
                    if (!pressureEntity) return '';
                    return html`<div class="chip" @click="${() => this._showMoreInfo(pressureEntity)}">
                        <div class="pressure-bars ${pressureClass}">
                            <div class="pb"></div><div class="pb"></div><div class="pb"></div><div class="pb"></div>
                        </div>
                        <span class="chip-label">${t(hass, 'chip_pressure')}</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>`;
                case 'intensity':
                    if (!intensityEntity) return '';
                    return html`<div class="chip" @click="${() => this._showMoreInfo(intensityEntity)}">
                        <div class="chip-icon ${intensityColor}"><ha-icon icon="${intensityIcon}"></ha-icon></div>
                        <span class="chip-label">${t(hass, 'chip_intensity')}</span>
                        <div class="chip-value ${intensityColor}">${displayIntensity}</div>
                    </div>`;
                case 'mode':
                    if (!entityIds.mode && !entityIds.mode_select) return '';
                    return html`<div class="mode-chip-wrap">
                        <div class="chip ${canSelectMode ? 'selectable' : ''}" @click="${() => this._handleModeChipClick()}">
                            <div class="chip-icon ${modeUnavailable ? 'muted' : 'blue'}"><ha-icon icon="${modeIcon}"></ha-icon></div>
                            <span class="chip-label">${t(hass, 'chip_mode')}</span>
                            <div class="chip-value ${modeUnavailable ? '' : 'blue'}">${modeLabel}${canSelectMode ? html`<span class="mode-caret"> ▾</span>` : ''}</div>
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
                    </div>`;
                case 'score':
                    if (!scoreAvailable) return '';
                    return html`<div class="chip" @click="${() => this._showMoreInfo(entityIds.score)}">
                        <div class="chip-icon ${scoreColor}"><ha-icon icon="${scoreIcon}"></ha-icon></div>
                        <span class="chip-label">${t(hass, 'chip_score')}</span>
                        <div class="chip-value ${scoreColor}">${scoreState}</div>
                    </div>`;
                case 'brush_head':
                    if (brushheadPct === null) return '';
                    return html`<div class="chip" @click="${() => this._showMoreInfo(entityIds.brushhead_wear)}">
                        <div class="chip-icon">${headSvg()}</div>
                        <span class="chip-label">${t(hass, 'chip_head')}</span>
                        <div class="chip-value ${bhColor}">${brushheadPct}%</div>
                    </div>`;
                default:
                    return '';
            }
        };

        // A property rendered as a compact corner marker (icon + label + value).
        // brush_head keeps its richer fill glyph; everything else is icon+value.
        const cornerEl = (pos, prop) => {
            const cls = POS_CLASS[pos];
            if (prop === 'brush_head') {
                if (brushheadPct === null) return '';
                return html`<div class="card-corner ${cls} brushhead-indicator" @click="${() => this._showMoreInfo(entityIds.brushhead_wear)}">
                    ${headSvg()}
                    <span class="corner-lbl">${t(hass, 'chip_head')}</span>
                    <span class="corner-val ${bhColor}">${brushheadPct}%</span>
                </div>`;
            }
            const marker = (entityId, icon, colorClass, label, value) => html`
                <div class="card-corner ${cls}" @click="${() => this._showMoreInfo(entityId)}">
                    <ha-icon class="corner-ico ${colorClass}" icon="${icon}"></ha-icon>
                    <span class="corner-lbl">${label}</span>
                    <span class="corner-val ${colorClass}">${value}</span>
                </div>`;
            switch (prop) {
                case 'battery':
                    if (!entityIds.battery) return '';
                    return marker(entityIds.battery, batteryIconName, batteryColor, t(hass, 'chip_battery'), batteryUnavailable ? '–' : html`${batteryLevel}%`);
                case 'pressure':
                    if (!pressureEntity) return '';
                    return marker(pressureEntity, 'mdi:gauge', pressureColor, t(hass, 'chip_pressure'), displayPressure);
                case 'intensity':
                    if (!intensityEntity) return '';
                    return marker(intensityEntity, intensityIcon, intensityColor, t(hass, 'chip_intensity'), displayIntensity);
                case 'mode':
                    if (!entityIds.mode && !entityIds.mode_select) return '';
                    return marker(entityIds.mode_select || entityIds.mode, modeIcon, modeUnavailable ? 'muted' : 'blue', t(hass, 'chip_mode'), modeLabel);
                case 'score':
                    if (!scoreAvailable) return '';
                    return marker(entityIds.score, scoreIcon, scoreColor, t(hass, 'chip_score'), scoreState);
                default:
                    return '';
            }
        };

        const chipEls = layout.chips.map(chipEl).filter(x => x !== '');
        // Top corners overlay the visual area (absolute); bottom corners render
        // in-flow inside the status row so they stay on the status-text line.
        const topCornerEls = ['top_left', 'top_right']
            .filter(pos => layout.corners[pos])
            .map(pos => cornerEl(pos, layout.corners[pos]))
            .filter(x => x !== '');
        const bottomLeftEl = layout.corners.bottom_left ? cornerEl('bottom_left', layout.corners.bottom_left) : '';
        const bottomRightEl = layout.corners.bottom_right ? cornerEl('bottom_right', layout.corners.bottom_right) : '';

        const showHeader = config.show_header !== false;
        // 'none' drops the tooth ring for a large standalone timer (compact
        // panel setups); anything else renders the classic teeth graphic.
        const showTeeth = config.tooth_style !== 'none';

        return html`
            <ha-card style="${this._cardStyle()}">
                <!-- Header -->
                ${showHeader ? html`
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
                </div>` : ''}

                <!-- Chips: configurable via layout.chips (omitted when empty) -->
                ${chipEls.length ? html`<div class="chips-row">${chipEls}</div>` : ''}

                <!-- Tooth visual -->
                <div class="visual-area">
                    ${showTeeth ? html`
                    <div class="tooth-wrap">
                        ${ToothSVG(sectorClassData, numSectors)}
                        <div class="center-info">
                            <span class="session-label">${t(hass, 'session')}</span>
                            <div class="timer-display ${active ? 'active' : ''}"
                                 @click="${() => this._showMoreInfo(entityIds.duration)}">
                                ${this._formatTime(displayDuration)}
                            </div>
                        </div>
                    </div>` : html`
                    <div class="center-info standalone" @click="${() => this._showMoreInfo(entityIds.duration)}">
                        <span class="session-label">${t(hass, 'session')}</span>
                        <div class="timer-display ${active ? 'active' : ''}">
                            ${this._formatTime(displayDuration)}
                        </div>
                    </div>`}

                    <div class="status-row">
                        <div>${bottomLeftEl}</div>
                        <div class="status-text-wrap" @click="${() => this._showMoreInfo(entityIds.base_entity)}">
                            <div class="status-main ${active ? 'active' : ''}">${displayStatus}</div>
                            ${sectorLabel ? html`<div class="status-sub">${sectorLabel}</div>` : ''}
                        </div>
                        <div>${bottomRightEl}</div>
                    </div>

                    <div class="progress-wrap ${active || isSuccess ? 'visible' : ''}">
                        <div class="progress-track">
                            ${Array.from({ length: numSectors || 1 }, (_, i) => {
                                // Same time-based fill as before, sliced into one
                                // sub-bar per sector so the boundaries are visible.
                                const n = numSectors || 1;
                                const segPct = Math.max(0, Math.min(100, (progressPct / 100 * n - i) * 100));
                                const fill = `width: ${segPct}%; background: linear-gradient(90deg, ${progressColorAt(i / n)}, ${progressColorAt((i + segPct / 100) / n)})`;
                                return html`<div class="progress-seg">
                                    <div class="progress-fill" style="${fill}"></div>
                                </div>`;
                            })}
                        </div>
                        <div class="progress-labels">
                            <span>${sectorLabel || ''}</span>
                            <span>${targetDuration > 0 ? html`${this._formatTime(displayDuration)} / ${this._formatTime(targetDuration)}` : ''}</span>
                            <span>${progressPct}%</span>
                        </div>
                    </div>

                    ${topCornerEls}
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
        // Chip colour class (green/amber/red), shared by the glyph fill and
        // the value text so head matches the battery chip sitting next to it.
        if (wear >= 80) return 'red';
        if (wear >= 60) return 'amber';
        return 'green';
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
        const entry = Object.values(hass.entities).find(isMainStateEntity);
        return { device_id: entry ? entry.device_id : "" };
    }
}
