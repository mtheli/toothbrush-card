import { LitElement, html, css, unsafeCSS } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ToothSVG } from './toothbrush-svg.js';
import { MODE_ICONS, CONN_ICONS, smileyTier, SMILEY_TIERS } from './icons.js';
import { t } from './translations.js';
import { formatDateTime } from './locale.js';
import { nextSessionState, initialSessionState, isVerdictFace,
         BRUSHING_DURATION, MIN_RECAP_SECONDS } from './session-state.js';
import { resolveSector, initialSectorState, resetCorrection, correctSectorIndex,
         trackVisitedSector, parseRawSectorIndex, decodesAllSectors } from './sector-state.js';
import styles from 'bundle-text:./toothbrush-card.css';

export const CARD_VERSION = "0.35.0";
// BUILD_DATE is stamped into src/build-info.js by scripts/gen_build_info.mjs,
// which the "build" script runs first. That file is generated (gitignored), so
// the value is "dev" only for editor/dev use before a build. Shown in the
// editor footer so it is obvious whether a new bundle actually loaded.
export { BUILD_DATE } from './build-info.js';

// BRUSHING_DURATION and MIN_RECAP_SECONDS live with the latch that defines
// them; the renderer needs both for the fallbacks it applies when a device
// reports no routine of its own.

// Integration domain -> matcher for the main state entity the card binds to.
// A device is supported iff it carries that entity — exactly the condition
// under which the card can render it, and one that sub-devices (e.g. the
// Sonicare Brush Head/Connection) never meet. Drives both the editor's
// device picker and getStubConfig; new integrations only need a line here
// plus their entity mapping in findDeviceEntities. Most integrations are
// matched by translation_key; xiaomi_ble names its entities library-side
// (no translation_key), so its main entity is recognized by entity_id
// suffix instead (entity_ids are language-independent). laifen_ble carries
// both matchers: releases up to 3.0.2 name entities via _attr_name and so
// always create English entity_ids, 3.0.3+ moved to translation_keys and
// ships de.json, so entity_ids are localized on non-English installs.
// `broadcast: true` marks an integration that only listens for advertisements
// and never holds a connection. It matters for the Bluetooth icon: there is no
// link to report the state of, and the entities keep their last values instead
// of going unavailable, so "the state is readable" says nothing about whether
// the brush is still there. Those handles are judged by when they were last
// heard from instead — see BROADCAST_SILENCE_SECONDS.
export const SUPPORTED_INTEGRATIONS = {
    oralb: { translationKey: 'toothbrush_state', broadcast: true },
    // Oral-B Live (custom integration) mirrors the built-in oralb translation
    // keys on purpose, so every reading below maps through the shared branch
    // in findDeviceEntities and no separate handling is needed. It does hold a
    // connection, though, and reports the handle as unavailable when it drops.
    oralb_live: { translationKey: 'toothbrush_state' },
    philips_sonicare_ble: { translationKey: 'handle_state' },
    xiaomi_ble: { idSuffix: '_toothbrush', broadcast: true },
    laifen_ble: { translationKey: 'status', idSuffix: '_status' },
};

// How long a broadcasting handle may stay quiet before the card stops claiming
// it is there.
//
// A resting handle does not advertise at all, so this only has to cover the
// tail after a session: a capture from two iO handles on 2026-08-13 showed one
// going silent the moment its session ended and the other carrying on for 96 s.
// Two minutes clears that with room to spare, and being generous costs nothing
// - the icon simply goes dark a little later.
//
// The consequence is deliberate: for a handle that only broadcasts, this icon
// is dark almost all day and lights up around a session. That is the truth of
// it. There is no connection to a brush sitting in its holder, and the old
// behaviour - permanently "connected" because the last advertised values were
// still readable - was the alternative.
const BROADCAST_SILENCE_SECONDS = 120;

// The states a result face may be adopted in, beside the motor actually
// running. The handle stops before it shows its verdict, so the face arrives
// in whatever state follows the session - and which state that is differs by
// model. The Sonicare-style handles announce a summary; an iO drops straight
// back to plain `idle` and shows its face there, for about a minute, which is
// why `idle` belongs here: without it the face of every iO session was thrown
// away in the same render it appeared in.
//
// `idle` is safe to open the window on because a face is only ever adopted
// when the smiley sensor actually names one: between sessions it reads `off`,
// which never latches. It says nothing about whether a session is finished -
// that is decided in session-state.js from the session having been active.
export const FACE_STATUSES = new Set([
    'idle',
    'session_summary',
    'post_brushing_summary',
    'post_brushing_statistics',
]);

/**
 * Whether the handle can be said to be there, for the header's Bluetooth icon.
 *
 * Three ways of answering, in descending order of how much the integration
 * actually knows:
 *
 *   - An explicit connection sensor is the whole answer where one exists
 *     (philips_sonicare_ble, laifen_ble).
 *   - An integration that holds a connection reports the handle unavailable
 *     when it drops, so a readable state means a live link (oralb_live).
 *   - A broadcasting one does neither. It freezes its last values and stays
 *     available, which is why this used to claim a connection to a handle
 *     switched off days ago. Only recency says anything there, and it has to
 *     be `last_updated`: an idle handle repeats the same state, so
 *     `last_changed` would go stale while the brush was still broadcasting.
 */
export function handleIsPresent({ integration, connectionState, status,
                                  lastUpdated, now }) {
    if (connectionState !== undefined && connectionState !== null) {
        return connectionState === 'on';
    }
    if (SUPPORTED_INTEGRATIONS[integration]?.broadcast === true) {
        const at = Date.parse(lastUpdated);
        return Number.isFinite(at)
            && (now - at) / 1000 < BROADCAST_SILENCE_SECONDS;
    }
    return status !== 'unavailable' && status !== 'unknown';
}

// True when this entity is the main state entity of a supported integration.
export function isMainStateEntity(entity) {
    const m = SUPPORTED_INTEGRATIONS[entity.platform];
    if (!m) return false;
    return (m.translationKey && entity.translation_key === m.translationKey)
        || (m.idSuffix && entity.entity_id.endsWith(m.idSuffix))
        || false;
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

// The intensity gauge sweeps 240° of a circle of radius 8.5 around (12, 13):
// from the lower left, clockwise over the top, to the lower right. Declared
// once because the track and the filled arc trace the same line, and
// `pathLength="100"` lets the fill be set as a percentage.
const INTENSITY_ARC = 'M4.64 17.25 A8.5 8.5 0 1 1 19.36 17.25';

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

// The colour the card paints with when neither the configuration nor the
// handle names one.
export const DEFAULT_ACCENT_COLOR = '#FFFFFF';

// The `#RRGGBB` an integration reports for the handle's own light ring.
const RING_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

// What an Oral-B handle stores for its ring is not a screen colour but the
// drive level of three LEDs behind a diffuser, and the three are not equally
// bright per unit of drive. The handle's own "white" is the calibration: the
// drive that makes the ring look white says how much each channel is worth.
//
// Measured on two iO handles by stepping through the colour menu and reading
// the value back for each name (21 August 2026):
//
//   white   44CF63     yellow  80FF00     blue   0F5BCC
//   pink    B2091A     orange  FC7000     turquoise 00FF3D
//
// Scaling each channel by 255/white and clamping turns white into white by
// construction - and then puts yellow at hue 60 and orange at hue 32, exactly
// where their names say. Five colours the factors were not derived from land
// on their own names, which is what makes this a measurement rather than a
// fit.
const RING_LED_WHITE = [0x44, 0xCF, 0x63];

// Only Oral-B handles are known to report drive levels. Another integration
// that one day reports a real screen colour must not have it stretched.
const RING_LED_PLATFORM = /^oralb/;

/** A drive-level triple as the colour the ring shows. */
function correctRingDrive(value) {
    const channels = [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
    return '#' + channels
        .map((channel, i) => Math.min(255, Math.round(channel * 255 / RING_LED_WHITE[i])))
        .map((channel) => channel.toString(16).padStart(2, '0').toUpperCase())
        .join('');
}

/**
 * The colour the device says its own ring is set to, or null.
 *
 * Only a six-digit hex colour counts, so `unknown`, `unavailable` and an
 * integration that reports something else read as "no colour" rather than
 * reaching the stylesheet.
 */
export function readRingColor(hass, entityIds) {
    const ringEntityId = entityIds?.ring_color;
    const ring = ringEntityId ? hass?.states?.[ringEntityId]?.state : null;
    if (typeof ring !== 'string') return null;
    const value = ring.trim();
    if (!RING_COLOR_PATTERN.test(value)) return null;
    const platform = hass?.entities?.[ringEntityId]?.platform || '';
    return RING_LED_PLATFORM.test(platform) ? correctRingDrive(value) : value;
}

/**
 * The accent colour for a card: a colour set in the configuration wins, then
 * the handle's own ring colour, then the card default.
 */
export function resolveAccentColor(config, hass, entityIds) {
    const configured = (config?.accent_color || '').trim();
    if (configured) return configured;
    return readRingColor(hass, entityIds) || DEFAULT_ACCENT_COLOR;
}

// Placeable readings and the four corner slots — shared by the card renderer
// and the editor so both agree on what can go where.
export const LAYOUT_PROPS = ['battery', 'pressure', 'intensity', 'mode', 'score', 'brush_head', 'head_type'];
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
 * the chip row is capped at four.
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
            if (chips.length >= 4) break;
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
        routine_length: null, routine_length_number: null, integration: null,
        brushhead_wear: null, brushhead_type: null,
        brushhead_sessions: null, activity: null,
        mode_select: null, esp_bridge_alive: null,
        ble_connected: null, score: null, pacer_30s: null,
        smiley: null, last_session: null, last_session_duration: null,
        ring_color: null
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
                // The sensor comes from MiBeacon object 0x1013, defined as
                // "Remaining amount of consumables" with a "Remaining
                // percentage, range 0~100" — so it is what is left, not what
                // has been used. xiaomi_ble's own parser only calls it
                // "Consumable (in percent)" and leaves the direction open,
                // which is why the definition is cited here rather than the
                // integration.
                entityKeys.brushhead_wear = entity.entity_id;
                entityKeys.brushhead_remaining = true;
            }
        }

        // laifen_ble: handled entirely here (note the continue) because two of
        // its translation_keys collide with mappings below — its `mode` exists
        // as both sensor and select, and its `brushing_time` is the configured
        // session length in minutes, not the elapsed time the shared branch
        // expects. Releases up to 3.0.2 ship no translation_keys, so every
        // role also matches by entity_id suffix (always English there).
        if (entity.platform === 'laifen_ble') {
            const tk = entity.translation_key;
            const domain = entityId.split('.')[0];
            const match = (dom, key, suffix) =>
                domain === dom && (tk === key || (!tk && entityId.endsWith(suffix)));
            if (match('sensor', 'status', '_status')) {
                entityKeys.status = entityId;
            } else if (match('sensor', 'timer', '_timer')) {
                // Synthetic elapsed seconds; keeps counting across short
                // pauses and only resets after ~60s of idle.
                entityKeys.duration = entityId;
            } else if (match('sensor', 'brushing_duration', '_brushing_duration')) {
                // Configured session length in seconds (models with an
                // adjustable duration). Preferred over brushing_time.
                entityKeys.routine_length = entityId;
                entityKeys.routine_length_minutes = false;
            } else if (match('number', 'brushing_duration', '_brushing_duration_adjustment')) {
                // The adjustable session length, in minutes. On the Wave (V1)
                // this is the only source: 3.0.3 drops the Brushing Time sensor
                // there, and the Brushing Duration sensor above is registered
                // on every device but stays unavailable unless the handle
                // reports the key (Wave Pro does, Wave does not). Kept beside
                // the sensor instead of replacing it, so the mapping stays a
                // pure registry lookup and the value side takes whichever of
                // the two actually reads. Neither handle reports the duration
                // back, so this reads "unknown" until it has been set once —
                // then the default applies, as it did before.
                entityKeys.routine_length_number = entityId;
            } else if (match('sensor', 'brushing_time', '_brushing_time')
                && entityKeys.routine_length === null) {
                // Session length in minutes; fixed-duration models report 0,
                // which the renderer treats as "unknown" (2-minute default).
                entityKeys.routine_length = entityId;
                entityKeys.routine_length_minutes = true;
            } else if (match('select', 'mode', '_mode')) {
                entityKeys.mode_select = entityId;
            } else if (match('sensor', 'mode', '_mode')) {
                entityKeys.mode = entityId;
            } else if (match('sensor', 'active_strength', '_strength')) {
                // The vibration strength the handle is currently running at.
                // A level, not a category: 1-10 in the ordinary modes and
                // 11-20 in the high-frequency one, so the value says which
                // scale it is on without the mode having to be read.
                //
                // The read-only sensor rather than the `vibration_strength`
                // number beside it: the chip reports what the handle is doing,
                // and the number is the control for changing it.
                entityKeys.intensity = entityId;
            } else if (match('binary_sensor', 'over_pressure_active', '_pressing_too_hard')) {
                entityKeys.pressure = entityId;
            } else if (match('binary_sensor', 'connection', '_connection')) {
                entityKeys.ble_connected = entityId;
            } else if (match('switch', 'reminder_30s', '_30s_reminder')) {
                // The handle's own 30-second pacer — used to align the
                // card's time-based sectors with the device's buzz rhythm.
                entityKeys.pacer_30s = entityId;
            } else if (entityKeys.battery === null && deviceClass === 'battery') {
                entityKeys.battery = entityId;
            }
            continue;
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
        } else if (entity.translation_key === 'smiley') {
            // oralb_live only: the handle's own display face, shown in the
            // done badge rather than as a chip — it is a session result, and
            // between sessions the sensor reads `off`.
            entityKeys.smiley = entity.entity_id;
        } else if (entity.translation_key === 'last_session') {
            // The handle's own record of the session it last finished, read
            // back from the device rather than watched happening. It is the
            // one source that still knows what a session was after the fact,
            // which is exactly when a card that was closed needs to be told.
            entityKeys.last_session = entity.entity_id;
        } else if (entity.translation_key === 'last_session_duration') {
            entityKeys.last_session_duration = entity.entity_id;
        } else if (entity.translation_key === 'ring_color') {
            // The colour the handle's own light ring is set to, which the card
            // can adopt as its accent. Only the selected device's is read: a
            // charging station publishes the colour of its own ring under a
            // key of its own, and that one belongs to a different device.
            entityKeys.ring_color = entity.entity_id;
        }

        // Sonicare translation_keys
        if (entity.translation_key === 'handle_state') {
            entityKeys.status = entity.entity_id;
        } else if (entity.translation_key === 'brushing_mode') {
            entityKeys.mode = entity.entity_id;
        } else if (entity.translation_key === 'pressure_state') {
            // Categorical pressure state (ok / optimal / too_high). Kept
            // separate so it can take precedence over the raw grams
            // 'pressure' sensor and the 'intensity' fallback regardless of
            // entity iteration order.
            //
            // The `pressure_alert` binary sensor beside it is deliberately not
            // mapped: philips_sonicare_ble gates both on the same IMU service,
            // so it never exists without this one, and this one always wins
            // where the value is read. It was mapped when the card first
            // learned Sonicare — one day after the integration gained
            // pressure_state — and only ever competed with the raw grams
            // sensor for the same slot, which is a number in a chip that shows
            // a word.
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
                } else if (entity.translation_key === 'brushhead_type') {
                    entityKeys.brushhead_type = entity.entity_id;
                } else if (entity.translation_key === 'brushhead_sessions_left') {
                    entityKeys.brushhead_sessions = entity.entity_id;
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
        this._applySectorState(initialSectorState());
        this._historyRecapState = null;
        this._historyRecapRetryAt = 0;
        // Completion latch (issue #4): persist the finished-session view. The
        // rules live in session-state.js; the card only holds the values.
        this._applySessionState(initialSessionState());
    }

    /** The latch state, gathered from the fields the card renders from. */
    _sessionState() {
        return {
            peakDuration: this._peakDuration,
            completed: this._completed,
            completedDuration: this._completedDuration,
            completedAt: this._completedAt,
            completedIsFull: this._completedIsFull,
            wasActiveSession: this._wasActiveSession,
            sessionRoutineLength: this._sessionRoutineLength,
            sessionStepSeconds: this._sessionStepSeconds,
            holdDismissed: this._holdDismissed,
            stashedRecap: this._stashedRecap,
            face: this._face,
            completedFace: this._completedFace,
            completedScore: this._completedScore,
            completedSource: this._completedSource,
            completedPressure: this._completedPressure,
            completedTarget: this._completedTarget,
            completedStepSeconds: this._completedStepSeconds,
            completedFromStash: this._completedFromStash,
            baselineSessionId: this._baselineSessionId,
        };
    }

    /**
     * Write a latch state back onto those fields.
     *
     * They stay individual properties rather than one object because the
     * template and the dismiss handling read them by name, and because lit
     * change detection is per property.
     */
    _applySessionState(state) {
        this._peakDuration = state.peakDuration;
        this._completed = state.completed;
        this._completedDuration = state.completedDuration;
        this._completedAt = state.completedAt;
        this._completedIsFull = state.completedIsFull;
        this._wasActiveSession = state.wasActiveSession;
        this._sessionRoutineLength = state.sessionRoutineLength;
        this._sessionStepSeconds = state.sessionStepSeconds;
        this._holdDismissed = state.holdDismissed;
        this._stashedRecap = state.stashedRecap;
        this._face = state.face;
        this._completedFace = state.completedFace;
        this._completedScore = state.completedScore;
        this._completedSource = state.completedSource;
        this._completedPressure = state.completedPressure;
        this._completedTarget = state.completedTarget;
        this._completedStepSeconds = state.completedStepSeconds;
        this._completedFromStash = state.completedFromStash;
        this._baselineSessionId = state.baselineSessionId;
    }

    // --- Dismiss persistence (issue #4/#5/#11) ---
    // localStorage only stores the dismissed marker (× on the badge) per
    // device — it suppresses re-deriving the same session until a new one
    // starts. The recap itself is re-derived on load from frozen sensor
    // values or recorder history, so it works on any browser or device.

    _holdStorageKey(deviceId) {
        return `toothbrush-card-hold-${deviceId}`;
    }

    _loadDismissed(deviceId) {
        try {
            const raw = localStorage.getItem(this._holdStorageKey(deviceId));
            return !!(raw && JSON.parse(raw)?.dismissed);
        } catch (e) {
            return false;
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

    _clearDismissed(deviceId) {
        try {
            localStorage.removeItem(this._holdStorageKey(deviceId));
        } catch (e) { /* ignore */ }
    }

    // --- History recap (issue #11) ---
    // When the post-session values are already wiped, the last session is
    // rebuilt from recorder history: one WebSocket query for the duration
    // entity, then a scan for the last "mountain" (rise to a peak, then
    // wiped back to 0). Only the peak and its timestamp are needed — the
    // completed view renders all zones as done. Opt out with
    // `history_recap: false`.
    //
    // The routine length rides along in the same query (issue #18). It decides
    // whether the session counts as complete, and the current state is the
    // wrong source for it twice over: it describes the routine set *now*, not
    // the one that governed the past session, and an integration that connects
    // actively (oralb_live) reports it as unavailable once the brush is back on
    // the charger — precisely when this rebuild has to run.

    // How far back an unbounded recap may reach. Mirrors the history
    // rebuild's own lookback, so both sources age out together.
    static MAX_RECAP_AGE_MS = 30 * 24 * 3600 * 1000;

    // How far apart two accounts of a session may be dated and still be the
    // same session. Only the record needs the room: it dates a session from
    // the handle's counter, to within a minute, while history dates it from
    // the reading itself.
    //
    // Must stay above the minute the record is given further down when it
    // offers itself against a session already on the badge. A rebuilt
    // session that displaces a record is offered that record again on the
    // very next render, and only that minute turns it away; were this the
    // smaller of the two, every rebuild would be taken back one render after
    // it arrived - and never asked for again, the query having already run.
    static RECORD_CLOCK_SLACK_MS = 120_000;

    /**
     * A record's session number, or null where there is none.
     *
     * Integrations that number their sessions report a count; those that do
     * not report the field as `null` - and `Number(null)` is 0, a perfectly
     * finite number that would compare equal to another record's absent one
     * and read as "the same session" for every session ever recorded.
     */
    static _sessionNumber(raw) {
        if (raw === null || raw === undefined || raw === '') return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    }

    _recapFromLastSession(hass, config, entityIds, routineFromEntity, notBefore = 0) {
        // The handle's own record of its last session, if the integration
        // offers one. Preferred over rebuilding the session from recorder
        // history for three reasons: it is what the device concluded rather
        // than what a series of readings implies, it needs no recorder and
        // no round trip, and it is right even where history is blind — a
        // session brushed while Home Assistant was down leaves no rows to
        // reconstruct, but the handle still remembers it.
        //
        // Returns whether a recap was built, so the caller knows whether the
        // history query is still needed.
        const stateObj = entityIds.last_session
            ? hass.states[entityIds.last_session] : null;
        if (!stateObj || stateObj.state === 'unknown'
            || stateObj.state === 'unavailable') return false;

        const attrs = stateObj.attributes || {};
        const startedAt = Date.parse(stateObj.state);
        if (!Number.isFinite(startedAt)) return false;
        // The duration lives on the record, but the integrations that expose
        // one also expose it as a reading of its own — either will do.
        const duration = Number(
            attrs.duration_seconds ?? (entityIds.last_session_duration
                ? hass.states[entityIds.last_session_duration]?.state : NaN)
        );
        if (!Number.isFinite(duration) || duration < MIN_RECAP_SECONDS) return false;
        // The state is when the session BEGAN. Both handles that file a
        // record stamp it as the session starts - it is the quantity they
        // measure, and the end is arithmetic on top of it - so that is what
        // the integrations report. A recap is about an ending, though: it
        // says how long ago somebody finished brushing, and it has to be
        // told apart from the session before it. So the end is worked out
        // here, once, and everything below deals in it.
        const endedAt = startedAt + duration * 1000;
        const fromStore = !attrs.source || attrs.source === 'retained_session';
        // The verdict the handle showed when this session ended, as the
        // record filed it. The live face sensor is no substitute: the display
        // goes back to sleep about a minute later, so a dashboard opened
        // afterwards - or a Home Assistant that restarted in between - never
        // sees one. The record outlives both.
        //
        // Whether the field is there at all separates two different silences.
        // An integration that does not file faces says nothing about the
        // session's verdict, and whatever the card watched the display show
        // still stands. One that files the field and leaves it empty is
        // saying it captured no verdict for this session - which is a
        // reading, and the reason the field is never filled with a stand-in.
        const recordFace = isVerdictFace(attrs.display_face)
            ? attrs.display_face : null;
        const recordFilesFace = attrs.display_face !== undefined;
        // Already on the badge, unchanged. The branch that offers a record
        // now runs on every render for as long as a better one could still
        // arrive, and adopting this one again would request a render from
        // inside a render - and go round for as long as the handle takes.
        // It passed every check below when it was first adopted.
        if (this._completedSource === 'device'
                && this._completedAt === endedAt
                && this._completedDuration === duration
                && this._completedFromStore === fromStore) {
            // Except for the face, which arrives after the record it belongs
            // to. A handle is switched off before it shows its verdict, so
            // the integration files the session first and fills the face in
            // over the seconds that follow - by which point everything above
            // matches and this recap would otherwise be left as it was.
            if (recordFace && this._face !== recordFace) {
                this._face = recordFace;
                this._completedFace = recordFace;
                this.requestUpdate();
            }
            return true;
        }
        // Replacing a recap that is already on screen, rather than building
        // the first one: only a record of that same session or a later one
        // will do. A handle that files its record late still holds the
        // previous session's until it does, and that one is not this one.
        //
        // Sessions are numbered in order, so where both the mark taken at the
        // start of this session and the record's own number are known, the
        // question is settled by comparing them - a later number is a later
        // session, and no clock is involved. The times are the fallback, and
        // a poor one: the record's is reconstructed from the handle's own
        // counter while the mark is taken whenever the card got round to
        // rendering, so the two drift apart for reasons that have nothing to
        // do with which session is which.
        if (notBefore) {
            // How far before the mark a record may be dated and still be
            // this session. The mark is meant to be the moment a session was
            // seen to end - which it is where the card watched one, and
            // where the recorder placed one, both accurate to seconds.
            //
            // Not where the recap was worked out from the readings left
            // standing: there the mark is the last time the duration reading
            // changed, and on a handle that has been away that is when it
            // came back - minutes or hours after the session it describes.
            // The handle's own record of that very session then reads as an
            // older one and is thrown away, which is how a correct record
            // went unused after a reload. So the allowance there is the
            // window the recap is shown for at all: anything older is not
            // this session by any reading, and anything newer cannot be
            // ruled out.
            //
            // The numbers are unaffected either way - they never involve a
            // clock, and they settle it wherever both sides have one.
            const holdWindow = config.hold_duration !== undefined
                ? (Number(config.hold_duration) || 0) * 3600000
                : 0.5 * 3600000;
            const slack = this._completedSource === 'reading'
                ? (holdWindow || this.constructor.MAX_RECAP_AGE_MS)
                : 60_000;
            const recordId = this.constructor._sessionNumber(attrs.session_id);
            const mark = this._baselineSessionId;
            if (mark !== null && mark !== undefined && recordId !== null) {
                // Same number as the mark: the handle is still holding the
                // session it had before this one, and that is not this one.
                if (recordId === mark) return false;
                // Lower: the numbering went backwards, which it cannot do by
                // counting - a handle reset, or a device that numbers its
                // sessions some other way entirely. Either way the mark says
                // nothing about this record, so it is dropped and the times
                // decide, as they did before there was a mark at all.
                if (recordId < mark) {
                    this._baselineSessionId = null;
                    if (endedAt < notBefore - slack) return false;
                }
            } else if (endedAt < notBefore - slack) {
                return false;
            }
        }
        // With no hold window there is nothing to expire a recap, and a
        // record outlives restarts - so an ancient one would sit there as
        // the current session forever. The same bound the history rebuild
        // uses for its lookback applies here.
        const holdHours = config.hold_duration !== undefined
            ? Number(config.hold_duration) || 0
            : 0.5;
        if (holdHours <= 0 && Date.now() - endedAt > this.constructor.MAX_RECAP_AGE_MS) return false;

        // The integration says so when the handle has finished a session it
        // has not written down yet: some only file the record as they switch
        // off, a minute or more after the motor stops. Until the newer one
        // arrives, this record describes the session before the one somebody
        // just brushed, and showing it as the recap would be worse than
        // showing nothing - the reading is right, the claim is not.
        if (attrs.superseded) return false;
        // The integration says how it arrived at the time. "collection" means
        // only that the session was already over when the record was read -
        // it could be days old, and the badge would announce it as just now.
        // A recap is a when as much as a what, so without a trustworthy when
        // there is nothing honest to show.
        if (attrs.time_source === 'collection') return false;

        // Same precedence as the history rebuild: an explicit setting wins,
        // then what the record itself says it was aiming for, then the
        // current reading. A device that reports a routine but cannot name
        // one right now gets no recap rather than a wrong verdict.
        const target = Number(config.routine_length)
            || Number(attrs.target_duration_seconds)
            || routineFromEntity
            || ((entityIds.routine_length || entityIds.routine_length_number)
                ? 0 : BRUSHING_DURATION);
        if (!target) return false;

        // Whether the recap on screen is another account of this same
        // session or of a different one, decided before the fields below
        // overwrite it. Two accounts of one session are dated apart: the
        // record works its ending out from the handle's counter, while a
        // watched one is stamped whenever the card got round to noticing -
        // so the slack the rest of the file already uses for that question
        // settles this one too.
        const sameSessionAsBadge = this._completed && this._completedAt > 0
            && Math.abs(this._completedAt - endedAt)
                <= this.constructor.RECORD_CLOCK_SLACK_MS;

        this._completed = true;
        this._completedIsFull = duration >= target * 0.9;
        this._completedDuration = duration;
        this._completedAt = endedAt;
        this._completedSource = 'device';
        // Read from the handle, or added up by the integration as it watched?
        // Both arrive as this one reading, and the badge must not credit the
        // handle with a session Home Assistant counted itself. Only one value
        // means "read": the others name how the readings reached the
        // integration, which is a different question, and a record from
        // before the field existed is from an integration that only read.
        this._completedFromStore = fromStore;
        // The record's verdict, where it has one. Latched rather than only
        // shown, so it stays put once the handle's display goes back to
        // sleep and the live face reads as nothing again.
        //
        // With no verdict on the record, a face the card watched the display
        // show is kept - but only for the session it was watching. A record
        // of a different session arrives with its own verdict or with none,
        // and neither is the one still on screen, so that face goes with the
        // recap it belonged to. Nothing is put in its place.
        if (recordFace) {
            this._face = recordFace;
        } else if (recordFilesFace && !sameSessionAsBadge) {
            this._face = null;
        }
        this._completedFace = this._face;
        this._completedTarget = target;
        // Not every record carries it, and a missing reading is not a
        // reading of none: a session brushed far too hard and one where the
        // handle simply never measured would then look identical, and the
        // second would be praised for it. Absent stays absent, and the
        // verdict below declines rather than guesses.
        const pressure = Number(attrs.pressure_seconds);
        this._completedPressure = Number.isFinite(pressure) ? pressure : null;
        // The record knows how the routine it describes was paced, which the
        // handle no longer does once somebody switches mode. Only from the
        // record: a session rebuilt from readings has no claim on it.
        const steps = Array.isArray(attrs.step_times_seconds)
            ? attrs.step_times_seconds.map(Number)
            : null;
        this._completedStepSeconds = steps
            && steps.length
            && steps.every((value) => Number.isFinite(value) && value > 0)
            ? steps : null;
        this.requestUpdate();
        return true;
    }

    async _maybeLoadRecapFromHistory(hass, config, entityIds, routineFromEntity) {
        if (this._historyRecapState) return;
        if (Date.now() < this._historyRecapRetryAt) return;
        this._historyRecapState = 'pending';
        // The query may outlive this configuration: captured so a device
        // switch in the editor neither blocks the new device's own query nor
        // shows it this device's session.
        const forDevice = config.device_id;
        const holdHours = config.hold_duration !== undefined
            ? Number(config.hold_duration) || 0
            : 0.5;
        // Sessions older than the hold window would be hidden anyway; with
        // hold_duration: 0 ("until next session") there is no time limit, so
        // look back generously — the recorder returns only what it still
        // retains (purge default: 10 days).
        const windowHours = holdHours > 0 ? holdHours : 30 * 24;
        const end = new Date();
        const start = new Date(end.getTime() - windowHours * 3600000);
        let rows = [];
        let routineRows = [];
        let routineNumberRows = [];
        try {
            const resp = await hass.callWS({
                type: 'history/history_during_period',
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                entity_ids: [entityIds.duration, entityIds.routine_length,
                    entityIds.routine_length_number].filter(Boolean),
                minimal_response: true,
                no_attributes: true,
                significant_changes_only: false,
            });
            rows = resp?.[entityIds.duration] || [];
            routineRows = entityIds.routine_length
                ? resp?.[entityIds.routine_length] || []
                : [];
            routineNumberRows = entityIds.routine_length_number
                ? resp?.[entityIds.routine_length_number] || []
                : [];
        } catch (e) {
            // Recorder still starting, or a transient socket error — retry on
            // a later render instead of giving up for the page's lifetime:
            // for oralb_live this query is the only way back to a recap. The
            // cooldown keeps a recorder that is down from being hammered.
            console.warn('toothbrush-card: history recap query failed', e);
            if (this.config?.device_id === forDevice) {
                this._historyRecapState = null;
                this._historyRecapRetryAt = Date.now() + 30000;
            }
            return;
        }
        // The world may have moved on while the query ran — including to
        // another device, whose state this stale result must not touch.
        if (this.config?.device_id !== forDevice) return;
        this._historyRecapState = 'done';
        // Somebody brushing right now, and a recap somebody has already
        // dismissed, are both answers of their own - neither is a question a
        // query that set off some time ago gets to reopen on arrival.
        if (this._wasActiveSession || this._holdDismissed) return;
        const session = this._lastSessionFromHistory(rows, MIN_RECAP_SECONDS);
        if (!session) return;
        // A record is already on the badge. It describes the same session
        // better than a series of readings does - it knows the routine that
        // was running, how hard it was brushed and which session it was - so
        // it is only displaced by a session that is genuinely later, not by
        // one that merely looks it.
        //
        // What "genuinely later" has to survive is the record's own clock: it
        // times a session by the handle's counter rather than by watching one
        // end, and lands within a minute of the truth. History has no such
        // slack - the peak and the wipe that follows it arrive together, so
        // its timestamp is the ending. Twice the record's worst case is
        // therefore the mark, and it still sits below the closest two real
        // sessions can end to one another, since a session takes minutes to
        // brush.
        const displacesTheRecord = this._completedSource === 'device'
            && session.endedAt
                > this._completedAt + this.constructor.RECORD_CLOCK_SLACK_MS;
        if (this._completed && !displacesTheRecord) return;
        // An explicit config value wins outright — it exists because the
        // entity's reading is not to be trusted. Then history, then the
        // current entity reading; without any of them the plain default
        // applies — but not for a device that does report a routine, since
        // measuring an aborted long routine against the short default would
        // announce it as complete.
        const target = Number(config.routine_length)
            || this._routineAtFromHistory(routineRows, session.endedAt,
                entityIds.routine_length_minutes)
            || this._routineAtFromHistory(routineNumberRows, session.endedAt, true)
            || routineFromEntity
            || ((entityIds.routine_length || entityIds.routine_length_number)
                ? 0 : BRUSHING_DURATION);
        if (!target) return;
        this._completed = true;
        this._completedIsFull = session.duration >= target * 0.9;
        this._completedDuration = session.duration;
        this._completedAt = session.endedAt;
        this._completedSource = 'history';
        this._completedTarget = target;
        // Recorder rows are durations only; a rebuilt session knows nothing
        // about pressure and must not inherit the last one's.
        this._completedPressure = null;
        // Nor its verdict. This branch only ever runs for a session later
        // than the one on the badge, and the face there was that session's -
        // read from its record or watched on the display. Recorder history
        // has no face of its own to put in its place, and none is the honest
        // answer: the session it rebuilt was one nobody was there to see.
        this._face = null;
        this._completedFace = null;
        this.requestUpdate();
    }

    _lastSessionFromHistory(rows, minDuration) {
        // rows: chronological history states; WS compressed keys are
        // s/lu (state / last_updated epoch seconds), REST-style objects
        // use state/last_updated. Returns the newest "mountain" that
        // reached minDuration — shorter blips are skipped, so a button
        // fumble after a real session doesn't hide the recap.
        let last = null;
        let peak = 0;
        let peakTs = 0;
        let prev = 0;
        for (const row of rows) {
            const v = parseFloat(row.s !== undefined ? row.s : row.state);
            if (!Number.isFinite(v)) continue;
            const ts = row.lu !== undefined
                ? row.lu * 1000
                : Date.parse(row.last_updated) || 0;
            // A rise out of zero (or a big drop while still positive — two
            // sessions without an observed wipe in between) starts a new
            // mountain; otherwise the peak just keeps growing.
            if (v > 0 && (prev <= 0 || v < prev - 60)) {
                if (peak >= minDuration) last = { duration: peak, endedAt: peakTs };
                peak = v;
                peakTs = ts;
            } else if (v >= peak) {
                peak = v;
                peakTs = ts;
            }
            prev = v;
        }
        if (peak >= minDuration) last = { duration: peak, endedAt: peakTs };
        return last;
    }

    _routineAtFromHistory(rows, endedAt, minutes) {
        // The routine length in force when that session ended — rows are
        // chronological, so the last one at or before the peak wins. Same unit
        // handling as the live read. 0 means history could not say (entity not
        // recorded, or only written after the session).
        let seconds = 0;
        for (const row of rows) {
            const ts = row.lu !== undefined
                ? row.lu * 1000
                : Date.parse(row.last_updated) || 0;
            if (ts > endedAt) break;
            const v = parseFloat(row.s !== undefined ? row.s : row.state);
            // Skips unavailable/unknown, which is the whole point here.
            if (Number.isFinite(v) && v > 0) {
                seconds = Math.round(v * (minutes ? 60 : 1));
            }
        }
        return seconds;
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
            this._historyRecapState = null;
            this._historyRecapRetryAt = 0;
            this._applySessionState({
                ...initialSessionState(),
                holdDismissed: this._loadDismissed(config.device_id),
            });
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
     * unset fall back to the CSS defaults; an accent left unset follows the
     * handle's own ring colour where the device reports one.
     */
    _cardStyle() {
        const c = this.config || {};
        const accent = resolveAccentColor(c, this._hass, this._entityIds);
        let style = `--accent-color: ${accent}`;
        if (c.tooth_color) style += `; --tb-tooth-color: ${c.tooth_color}`;
        if (c.active_color) style += `; --tb-active-color: ${c.active_color}`;
        if (c.done_color) style += `; --tb-done-color: ${c.done_color}`;
        // Visual-area scale (issue #8): ring, timer, status, corner markers
        // and progress bar. Header and chips keep their size.
        const scale = Number(c.scale);
        if (Number.isFinite(scale) && scale > 0 && scale !== 1) {
            style += `; --tb-scale: ${Math.min(2, Math.max(0.8, scale))}`;
        }
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

    // --- Sector resolution ---
    // The rules live in sector-state.js. These stay as methods because the
    // template and the tests reach for them by name, and because the state is
    // still held as individual properties.

    _sectorState() {
        return {
            highestSector: this._highestSector,
            lastRawIndex: this._lastRawIndex,
            correctedIndex: this._correctedIndex,
            wasActive: this._wasActive,
            visitedSectors: this._visitedSectors,
        };
    }

    _applySectorState(state) {
        this._highestSector = state.highestSector;
        this._lastRawIndex = state.lastRawIndex;
        this._correctedIndex = state.correctedIndex;
        this._wasActive = state.wasActive;
        this._visitedSectors = state.visitedSectors;
    }

    _resetSectorCorrection() {
        this._applySectorState(resetCorrection(this._sectorState()));
    }

    /** Looks the enum options up; deciding what they mean is sector-state's. */
    _sectorEntityDecodesAllSectors(hass, sectorEntityId) {
        if (!sectorEntityId) return false;
        return decodesAllSectors(hass.states[sectorEntityId]?.attributes?.options);
    }

    _correctSectorIndex(rawIndex, active, maxIndex) {
        const result = correctSectorIndex(this._sectorState(), { rawIndex, active, maxIndex });
        this._applySectorState(result.state);
        return result.index;
    }

    _trackVisitedSector(rawIndex, active) {
        const result = trackVisitedSector(this._sectorState(), { rawIndex, active });
        this._applySectorState(result.state);
        return result.count;
    }

    _parseRawSectorIndex(sector) {
        return parseRawSectorIndex(sector);
    }

    _getSectorData(sector, activeIndex, sectorOrder, doneCount = null) {
        const sectorClassMaps = {};
        sectorOrder.forEach(s => { sectorClassMaps[s] = { done: false, brushing: false }; });

        if (sector === 'success') {
            sectorOrder.forEach(s => { sectorClassMaps[s].done = true; });
            return sectorClassMaps;
        }

        if (activeIndex === -1 || activeIndex >= sectorOrder.length) {
            // No zone is being brushed - idle, or a finished session being
            // held. A count can still be known there: a recap that stopped
            // early carries how far it got, and the ring is where that shows
            // as something other than a number in a sentence.
            if (doneCount) {
                sectorOrder.forEach((name, index) => {
                    if (index < doneCount) sectorClassMaps[name].done = true;
                });
            }
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

    /**
     * Reduce an intensity reading to low / medium / high for icon and colour.
     *
     * Named levels pass through. A numeric one is graded within the scale it
     * sits on: Laifen reports 1-10 in the ordinary modes and 11-20 in the
     * high-frequency one, so the value itself says which applies and the mode
     * never has to be read. Returns null for anything unreadable, which the
     * callers render as neutral rather than guessing.
     */
    _intensityLevel(intensity) {
        const v = String(intensity).toLowerCase();
        if (v === 'low' || v === 'medium' || v === 'high') return v;
        const n = Number(v);
        if (!Number.isFinite(n) || n <= 0) return null;
        const highFrequency = n > 10;
        const min = highFrequency ? 11 : 1;
        const max = highFrequency ? 20 : 10;
        const position = (n - min) / (max - min);
        return position >= 0.67 ? 'high' : position >= 0.34 ? 'medium' : 'low';
    }

    /**
     * Where a reading sits on its scale, 0…1, for the gauge arc and needle.
     *
     * Continuous rather than stepped: a Laifen handle reports 1-10, and the
     * three speedometer icons MDI offers could express almost none of that.
     * The scale is chosen by the value itself - 1-10 in the ordinary modes,
     * 11-20 in the high-frequency one - so the mode never has to be read, and
     * 11 sits at the bottom of its own scale rather than at the top of the
     * other. Returns 0 for anything unreadable.
     *
     * The floor of 0.08 keeps the weakest setting visible: a running handle at
     * strength 1 should read as "on and low", not as "no reading".
     */
    _intensityFraction(intensity) {
        const level = this._intensityLevel(intensity);
        if (!level) return 0;
        const n = Number(String(intensity).toLowerCase());
        if (!Number.isFinite(n)) return { low: 0.12, medium: 0.5, high: 1 }[level];
        const highFrequency = n > 10;
        const min = highFrequency ? 11 : 1;
        const max = highFrequency ? 20 : 10;
        return 0.08 + 0.92 * ((n - min) / (max - min));
    }

    /**
     * The needle tip for a fraction, on a 240° arc of radius `radius`
     * around (12, 13) — from 210° at the lower left, clockwise to -30°.
     */
    _intensityNeedle(fraction, radius) {
        const radians = (210 - 240 * fraction) * Math.PI / 180;
        return {
            x: 12 + radius * Math.cos(radians),
            y: 13 - radius * Math.sin(radians),
        };
    }

    /**
     * The pressure staircase, shared by the chip and the corner marker.
     *
     * How many bars light up comes from the class, not from here, so the
     * markup is the same wherever it is placed.
     */
    _pressureBars(pressureClass) {
        return html`
            <div class="pressure-bars ${pressureClass}">
                <div class="pb"></div><div class="pb"></div><div class="pb"></div><div class="pb"></div>
            </div>`;
    }

    /**
     * The gauge itself, shared by the chip and the corner marker.
     *
     * Carries no colour of its own: the caller's wrapper sets it, and every
     * stroke picks it up through currentColor.
     */
    _intensityDial(intensity) {
        const fraction = this._intensityFraction(intensity);
        const needle = this._intensityNeedle(fraction, 5.2);
        return html`
            <svg class="intensity-dial" viewBox="0 0 24 24">
                <path class="id-track" d="${INTENSITY_ARC}" pathLength="100"/>
                <path class="id-arc" d="${INTENSITY_ARC}" pathLength="100"
                      stroke-dasharray="${Math.round(fraction * 100)} 100"/>
                <line class="id-needle" x1="12" y1="13"
                      x2="${needle.x.toFixed(2)}" y2="${needle.y.toFixed(2)}"/>
                <circle class="id-hub" cx="12" cy="13" r="1.5"/>
            </svg>`;
    }

    _getIntensityColor(intensity) {
        // Own, non-alarming level scale — intensity is a chosen setting, so a
        // high level must never read as a warning (unlike pressure's red).
        const level = this._intensityLevel(intensity);
        if (level === 'high') return 'int-high';
        if (level === 'medium') return 'int-med';
        if (level === 'low') return 'int-low';
        return 'muted';
    }

    _normalizeLayout(config) {
        return normalizeLayout(config);
    }

    /**
     * How long each pacing step of the running routine lasts, in seconds,
     * where the integration says so (`sector_times_seconds`).
     *
     * A step is one buzz of the handle, not one zone, and the two are not
     * the same number: the Sonicare modes that revisit sectors take eight
     * (White+) or ten (Gum Health) steps over six zones. Dividing the
     * routine by the zone count therefore draws the boundaries where
     * nothing happens - by the end of a Gum Health routine, a third of a
     * step out.
     *
     * Two names, because the integrations mean subtly different things by
     * their lists. `step_times_seconds` is one entry per buzz and is what
     * this wants; `sector_times_seconds` is oralb_live's, one entry per
     * zone, which is the same thing there and only there - its own sector
     * reading says `supports_revisits: false`, so a zone cannot come round
     * twice. Should a handle ever revisit and publish only per-zone times,
     * the per-step list is the one that would have to arrive; hence the
     * order.
     *
     * Read from whichever entity carries it: Sonicare puts it on the mode,
     * where the pacing belongs - it changes when somebody switches routine,
     * not while brushing, and it is there before a session starts. oralb_live
     * puts its own list on the sector count and the routine length, because
     * there the division is a setting of the handle rather than of the mode.
     * Only
     * a list of positive numbers counts; an integration that has the field
     * but no value for it (oralb_live before the pacer has been read) says
     * `null`, and the bar falls back to equal segments.
     */
    _routineStepSeconds(hass, entityIds) {
        for (const attribute of ['step_times_seconds', 'sector_times_seconds']) {
            for (const key of ['mode', 'sector', 'number_of_sectors', 'routine_length']) {
                const entityId = entityIds[key];
                const raw = entityId
                    ? hass.states[entityId]?.attributes?.[attribute]
                    : null;
                if (!Array.isArray(raw) || !raw.length) continue;
                const seconds = raw.map(Number);
                if (seconds.every((value) => Number.isFinite(value) && value > 0)) {
                    return seconds;
                }
            }
        }
        return null;
    }

    _isActive(status) {
        // Case-insensitive: laifen_ble reports capitalized states.
        const s = String(status).toLowerCase();
        return s === 'running' || s === 'run';
    }

    /**
     * Searching for all needed entities.
     */
    _findAndMapEntitiesInConfig(hass, deviceId) {
        return findDeviceEntities(hass, deviceId);
    }

    render() {
        const config = this.config;
        // config.language overrides the HA profile language for this card (#17)
        const hass = config?.language && this._hass
            ? Object.assign(Object.create(this._hass), { language: config.language })
            : this._hass;

        if (!hass || !config || !this._entityIds) {
            if (hass && config?.device_id) {
                this._entityIds = this._findAndMapEntitiesInConfig(hass, config.device_id);
            } else {
                throw new Error('Please enter the device id');
            }
        }

        const entityIds = this._entityIds;
        const device = hass.devices[config.device_id];
        if (!device) {
            // The config points at a device this instance doesn't have
            // (deleted, or a dashboard copied from another install). A
            // render-time throw would just die unseen in the update promise
            // and leave a dead card — show a hint instead.
            return html`<ha-card><div class="device-not-found">${t(hass, 'device_not_found')}</div></ha-card>`;
        }
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
        let numSectors = config.num_sectors || numSectorsFromEntity || 4;
        const statusEntityId = entityIds.base_entity;
        // Lowercased: laifen_ble capitalizes its states (Running/Idle/Unknown).
        const rawStatus = (statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown')
            .toLowerCase();
        // Binary main state entities (xiaomi_ble) report plain on/off.
        const status = rawStatus === 'on' ? 'running' : rawStatus === 'off' ? 'idle' : rawStatus;
        // The built-in oralb integration reports its states with spaces
        // ("post brushing statistics"), oralb_live underscored — the slug is
        // the one spelling locale keys and status sets are written in.
        const statusSlug = status.replace(/ /g, '_');
        // How the running routine paces itself, where the integration says
        // so. Read here rather than at the bar, because the latch needs it
        // too - it belongs to the session, and the session ends first.
        const liveStepSeconds = this._routineStepSeconds(hass, entityIds);
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
        // Routine length: config override first, then the entity (some report
        // minutes, possibly fractional); devices without a sector entity fall
        // back to the 2-minute default so the time-based sector path can run.
        const routineFromSensor = entityIds.routine_length
            ? (parseFloat(hass.states[entityIds.routine_length]?.state) || 0)
                * (entityIds.routine_length_minutes ? 60 : 1)
            : 0;
        // A settable routine (Laifen number entity, minutes) stands in when no
        // sensor reports one — on the Wave the sensor exists but never leaves
        // "unavailable", so the number is all there is.
        const routineFromEntity = routineFromSensor || (entityIds.routine_length_number
            ? (parseFloat(hass.states[entityIds.routine_length_number]?.state) || 0) * 60
            : 0);
        const routineLength = Number(config.routine_length)
            || Math.round(routineFromEntity)
            || (entityIds.sector ? 0 : BRUSHING_DURATION);
        // With the handle's 30-second pacer enabled, the brush itself buzzes
        // every 30s — advance the time-based sectors in the same rhythm so
        // card and handle switch zones together. Only counts with an
        // anatomical zone mapping (4/6) are eligible: 4 is the default
        // already, so just the 6×30s case (3-minute routine) changes here.
        // An explicit sector configuration always wins.
        if (entityIds.pacer_30s && !config.num_sectors && !numSectorsFromEntity
            && hass.states[entityIds.pacer_30s]?.state === 'on'
            && Math.round(routineLength / 30) === 6) {
            numSectors = 6;
        }

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
        const latch = nextSessionState(this._sessionState(), {
            active,
            duration,
            routineLength,
            now: Date.now(),
            holdCompleted,
            hasRoutineEntity: !!entityIds.routine_length,
            hasDurationEntity: !!entityIds.duration,
            durationLastChanged: entityIds.duration
                ? hass.states[entityIds.duration]?.last_changed
                : null,
            // The handle shows its verdict in a summary state, which is not
            // `active` — so the window stays open past the end of the session.
            displayFace: entityIds.smiley
                ? hass.states[entityIds.smiley]?.state
                : null,
            faceWindow: active || FACE_STATUSES.has(statusSlug),
            // Snapshotted with the session, so a recap keeps the pacing of
            // the routine that ran rather than of whatever is set later.
            stepSeconds: liveStepSeconds,
            // Xiaomi reports a score only when the handle switches off, so it
            // describes the session that just ended rather than the one in
            // progress - which is what makes it belong on the badge.
            displayScore: entityIds.score
                ? hass.states[entityIds.score]?.state ?? null
                : null,
        });
        this._applySessionState(latch.state);
        if (latch.sessionStarted) {
            // Both belong to the card rather than to the latch: the visited
            // sectors are the other state machine's, and forgetting a
            // dismissal touches localStorage.
            this._visitedSectors = null;
            this._clearDismissed(config.device_id);
            // The session the handle had filed before this one began. Read
            // now because right now it is unambiguous: whatever record is on
            // offer at the start of a session belongs to an earlier one. A
            // record that later reports a higher number is this session's,
            // and says so without either side consulting a clock.
            this._baselineSessionId = this.constructor._sessionNumber(
                entityIds.last_session
                    ? hass.states[entityIds.last_session]?.attributes?.session_id
                    : null,
            );
        }
        if (latch.needsRecap) {
            // Deliberately the raw entity reading, not `routineLength`: its
            // defaults must not paper over a routine sensor that is currently
            // unreadable — the rebuild declines in that case (a Sonicare's
            // aborted 3-minute routine measured against the 2-minute default
            // would read as complete).
            const target = Math.round(routineFromEntity);
            // Two separate settings, because they are two separate things -
            // one reads what the handle concluded, the other reconstructs a
            // session from readings Home Assistant happened to store, and
            // turning the reconstruction off never meant refusing the
            // handle's own account of itself.
            if (config.device_recap !== false) {
                this._recapFromLastSession(hass, config, entityIds, target);
            }
            // Both, rather than the recorder only if the record declined.
            // Neither source is reliably the later one: a handle that files
            // its record late still holds the session before this one, while
            // a session brushed out of range left no rows to find. Asking
            // only one of them means missing whichever session the other
            // was holding. The record is read first because it is already
            // in hand - the badge appears at once - and the query below
            // settles which of the two sessions is the more recent when it
            // returns.
            if (config.history_recap !== false) {
                this._maybeLoadRecapFromHistory(hass, config, entityIds, target);
            }
        } else if (this._completed && config.device_recap !== false
                && entityIds.last_session
                && (this._completedSource !== 'device'
                    || !this._completedFromStore)) {
            // Still worth asking while the reading can improve on what the
            // badge holds. Twice over, because a record arrives in two
            // stages on a handle whose integration counts the session as it
            // watches: its own account first, and the handle's - which knows
            // the session number and how hard it was brushed - whenever the
            // handle gets round to filing it, which can be the next time
            // anything connects. Stopping at the first would leave the badge
            // crediting a source it never read.
            //
            // A session the card watched end, on a handle that files a record
            // of it a moment later. The record is the better account of the
            // same session - it knows the routine that was running and how
            // much of it was brushed too hard - so it takes over once it
            // arrives.
            this._recapFromLastSession(hass, config, entityIds,
                Math.round(routineFromEntity), this._completedAt);
        }
        // hold_duration in hours; absent = 0.5 h default, explicit 0 = until
        // the next session. After expiry the recap is merely hidden — a later
        // setting change can re-show it.
        const holdHours = config.hold_duration !== undefined
            ? Number(config.hold_duration) || 0
            : 0.5;
        const holdExpired = holdHours > 0 && this._completedAt > 0
            && Date.now() - this._completedAt > holdHours * 3600000;
        const showRecap = holdCompleted && this._completed && !active && !holdExpired;
        const showCompleted = showRecap && this._completedIsFull;
        const showAborted = showRecap && !this._completedIsFull;

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
                                <title>${t(hass, 'conn_bt_disconnected')}</title>
                                <path d="${CONN_ICONS.bluetooth_off}"/>
                            </svg>
                            ${entityIds.esp_bridge_alive ? html`
                            <svg class="conn-icon ${espConnected ? '' : 'disconnected'}" viewBox="0 0 24 24" fill="currentColor"
                                 @click="${() => this._showMoreInfo(entityIds.esp_bridge_alive)}">
                                <title>${espConnected ? t(hass, 'conn_bridge_online') : t(hass, 'conn_bridge_offline')}</title>
                                <path d="${espConnected ? CONN_ICONS.network : CONN_ICONS.network_off}"/>
                            </svg>` : ''}
                            <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                                 @click="${() => this._showDeviceInfo()}">
                                <title>${t(hass, 'conn_device_info')}</title>
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

        // From HA 2026.8 on, oralb_ble decodes sectors 5/6 itself — take the
        // raw value as-is. Older installations keep the _correctSectorIndex
        // workaround, which only ever compensated the built-in integration's
        // bug of reporting sector 5/6 as 4. oralb_live decodes correctly on
        // every release, so it must never run through the workaround: a
        // legitimately repeated or lower sector after a reconnect would be
        // misread as a wrap and advanced past the real zone.
        const sectorsAreUpstreamDecoded = entityIds.integration === 'oralb_live'
            || (entityIds.integration === 'oralb'
                && this._sectorEntityDecodesAllSectors(hass, entityIds.sector));

        // Sector: use real entity if available, otherwise compute from time
        let sector;
        if (entityIds.sector) {
            sector = hass.states[entityIds.sector]?.state || 'no_sector';
            // The same oralb_ble release removed the `success` sector value
            // and resets the sector as soon as the motor stops — a finished
            // routine no longer announces itself through the entity, so it is
            // derived here from the reached target (same 0.9 tolerance as the
            // completion latch), keeping the completed view independent of
            // `hold_completed`. Two guards keep the derivation honest: only
            // while the frames are fresh — a broadcast handle that goes
            // offline on its summary screen freezes these values forever, and
            // without the guard the card showed a permanent finished view
            // that neither dismissal nor the hold window could clear — and
            // never against a dismissed recap. Known residue: a mid-session
            // pause within the 0.9 tolerance flashes the finished view until
            // brushing resumes; pause and finish both read idle/no_sector
            // here, the distinguishing bits are masked off upstream. A
            // routine the entity does not report can only come from
            // `routine_length` in the config — without it, a longer routine
            // is measured against the 2-minute default. Older releases
            // deliver `success` directly and pass through unchanged.
            const summaryFresh =
                !SUPPORTED_INTEGRATIONS[entityIds.integration]?.broadcast
                || (Date.now() - Date.parse(
                    hass.states[statusEntityId]?.last_updated ?? '')) / 1000
                    < BROADCAST_SILENCE_SECONDS;
            if (sectorsAreUpstreamDecoded && sector === 'no_sector' && !active
                && summaryFresh && !this._holdDismissed
                && duration >= (routineLength || BRUSHING_DURATION) * 0.9) {
                sector = 'success';
            }
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
        const displayDuration = showRecap ? this._completedDuration : duration;

        // Computed values
        const defaultOrder = numSectors === 6 ? SEXTANT_ZONES : QUADRANT_ZONES;
        const sectorOrder = config.sector_order?.length === numSectors
            ? config.sector_order
            : defaultOrder;
        // Sonicare reports anatomical sectors including revisits (White+,
        // Gum Health), so a zone already finished must stay finished when the
        // reading jumps back. Passed to the resolver as behaviour rather than
        // as an integration name.
        const allowsRevisits = entityIds.integration === 'philips_sonicare_ble'
            && routineLength > 0;
        const resolved = resolveSector(this._sectorState(), {
            sector,
            active,
            zoneCount: sectorOrder.length,
            duration,
            routineLength,
            allowsRevisits,
            sectorsAreUpstreamDecoded,
        });
        this._applySectorState(resolved.state);
        const correctedIndex = resolved.index;
        const targetDuration = routineLength || BRUSHING_DURATION;
        // What a recap is measured against: the routine that ran, not the one
        // set now. Switching mode after brushing would otherwise redraw the
        // session against a different length - a 3:20 Gum Health run suddenly
        // reported as 32% of a 2:00 Clean. Falls back to the live reading
        // where the session never recorded one.
        const recapTarget = (showRecap && this._completedTarget) || targetDuration;
        // A session that stopped early, with no zones to show for it. The
        // card only knows which zones were brushed if it was open at the
        // time - reload the page and that is gone, while the recap itself
        // survives in the reading or the record. The badge then said "4 of 6
        // sextants finished" over a ring with nothing marked at all.
        //
        // The count is the one the badge prints, worked out the same way, so
        // the two cannot disagree. Which zones those were is the routine's
        // order, which is what the card already assumes for every handle
        // that reports no sectors of its own. Only where nothing was
        // observed: a session the card did watch keeps what it saw, revisits
        // and all.
        const doneCount = showAborted && !resolved.doneCount
            ? Math.min(sectorOrder.length,
                Math.floor(displayDuration / (recapTarget / sectorOrder.length)))
            : resolved.doneCount;
        const sectorClassData = this._getSectorData(sector, correctedIndex, sectorOrder, doneCount);
        const sectorLabel = this._getSectorLabel(sector, correctedIndex, sectorOrder);
        const isSuccess = sector === 'success';
        const batteryColor = batteryUnavailable ? 'muted' : this._getBatteryChipColor(batteryLevel);
        const batteryIsCharging = status === 'charging' || status === 'charge';
        const batteryIconName = batteryUnavailable ? 'mdi:battery-unknown' : this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const pressureColor = this._getPressureColor(pressure);
        const pressureClass = this._getPressureClass(pressure);
        const intensityColor = this._getIntensityColor(intensity);
        const modeUnavailable = mode === 'unavailable' || mode === 'unknown' || mode === 'N/A';
        const modeIcon = modeUnavailable ? 'mdi:brush-variant' : this._getModeIcon(mode);
        const modeLabel = modeUnavailable ? '–' : this._getModeLabel(mode);
        const progressPct = showCompleted
            ? 100
            : Math.min(100, Math.round(displayDuration / recapTarget * 100));
        // The bar is divided by the routine's own steps where they are
        // known, and by the zone count everywhere else. Deliberately not
        // `numSectors`, which counts zones and is right for the ring, the
        // zone order and the "x of y" sentence - only the bar is about
        // pacing. `num_sectors` in the configuration overrides the zone
        // count for those, not this: how often the handle buzzes is the
        // handle's business, not a display setting.
        const segmentSeconds = (showRecap
            ? this._completedStepSeconds || liveStepSeconds
            : liveStepSeconds)
            || Array.from({ length: numSectors || 1 }, () => 1);
        const segmentTotal = segmentSeconds.reduce((sum, value) => sum + value, 0);
        const statusKey = 'status_' + statusSlug;
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
        const btConnected = handleIsPresent({
            integration: entityIds.integration,
            connectionState: entityIds.ble_connected
                ? hass.states[entityIds.ble_connected]?.state ?? 'off' : null,
            status,
            lastUpdated: statusEntityId
                ? hass.states[statusEntityId]?.last_updated : null,
            now: Date.now(),
        });
        const btActive = active || batteryIsCharging;
        // Charging station (oralb_live): the handle talks through an iO Sense
        // instead of holding its single BLE slot for us. Both facts sit on the
        // main entity, so no extra entity lookup is needed. Deliberately not a
        // health signal — an idle station is the normal state between sessions,
        // and losing it only degrades the integration to advertisements.
        const baseAttrs = hass.states[entityIds.base_entity]?.attributes || {};
        const hasCharger = !!baseAttrs.charger_address;
        const viaCharger = baseAttrs.data_source === 'charger_bridge';

        // Age line under the done badge ("2 h ago") — a held recap must not
        // read as a just-finished session the next morning. Ticks via the
        // existing 1 s interval.
        let completedAgo = '';
        if (showRecap && this._completedAt > 0) {
            const mins = Math.floor((Date.now() - this._completedAt) / 60000);
            if (mins < 1) {
                completedAgo = t(hass, 'completed_just_now');
            } else if (mins < 60) {
                completedAgo = t(hass, 'completed_ago_minutes').replace('{n}', mins);
            } else {
                completedAgo = t(hass, 'completed_ago_hours').replace('{n}', Math.floor(mins / 60));
            }
        }

        // The relative time answers "recently or not", which is what the
        // badge is for. When that is not enough - was it this morning or
        // last night - the exact time is one hover away rather than a
        // second line nobody reads.
        const completedAtLabel = showRecap && this._completedAt > 0
            ? formatDateTime(hass, this._completedAt)
            : '';
        // Where the recap came from. The three sources differ in what they
        // are worth - one was watched happening, one was worked out from
        // recorded history, and one is the brush's own record - and that is
        // worth being able to find out when a reading surprises somebody.
        const completedSourceLabel = showRecap
            ? t(hass, {
                device: this._completedFromStore
                    ? 'recap_source_device' : 'recap_source_counted',
                history: 'recap_source_history',
                reading: 'recap_source_reading',
            }[this._completedSource] || 'recap_source_live')
            : '';

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

        // The handle's own display face, latched at the end of the session and
        // shown in the done badge. Undecoded values carry `code` and render a
        // question mark with the raw value, so users can report what their
        // handle actually showed (issue #20).
        // The badge's glyph slot holds whichever verdict the handle gave. The
        // two can never collide - the face is oralb_live, the score is Xiaomi -
        // so they share the place rather than competing for it. That is also
        // why show_verdict is a plain on/off and not a choice between the two:
        // on any given device there is only ever one candidate, so "show the
        // face instead of the score" would be a setting with nothing to switch.
        const showVerdict = showRecap && config.show_verdict !== false;
        // A handle that shows no face of its own can still be given a verdict,
        // but it has to be ours rather than the device's - computed from what
        // the session was, and said to be ours on the badge.
        //
        // Measured against the routine rather than in absolute seconds: two
        // minutes is a whole session on one handle and half of one on
        // another. Pressure only ever lowers the verdict - brushing gently is
        // not an achievement, brushing hard is a fault.
        // Not where the device already gives a verdict of its own - a face
        // from the handle or a score from the integration. They share this
        // one slot on the badge, and a computed opinion must not push a
        // reported fact out of it.
        // Only for a recap read from the handle's own record. That is where
        // the two things a verdict needs actually are - the routine this
        // session ran and how much of it was brushed too hard - and a
        // rebuild from recorder rows knows neither.
        // How far the session got is enough for a verdict on its own; how
        // hard it was brushed is what sharpens the top of the scale.
        //
        // The best face is reserved for the pressure reading, because it is
        // the one thing the clock cannot say: "ran its course" and "ran its
        // course and was brushed gently" are different sessions, and only
        // the second deserves the best of four faces. Without the reading
        // the card gives the best its data supports rather than the best
        // there is - and never praises a session brushed hard throughout for
        // having lasted, which is what a duration-only top mark would do.
        const ownVerdict = showVerdict && this._completedSource === 'device'
                && !this._completedFace
                && !Number.isFinite(parseFloat(this._completedScore))
                && this._completedDuration > 0
            ? (() => {
                // The routine this session ran, where the recap carries it:
                // measuring a three-minute session against whatever the
                // handle is set to now would judge the wrong routine.
                const ran = this._completedDuration / (this._completedTarget || targetDuration);
                if (ran < 0.5) return 'poor';
                if (ran < 0.9) return 'fair';
                if (!Number.isFinite(this._completedPressure)) return 'good';
                const pressed = this._completedPressure / this._completedDuration;
                return pressed > 0.1 ? 'fair' : pressed > 0.02 ? 'good' : 'excellent';
            })()
            : null;
        const recapFace = showVerdict
            ? (smileyTier(this._completedFace)
                || (ownVerdict ? { ...SMILEY_TIERS[ownVerdict], computed: true } : null))
            : null;
        const recapScoreNum = showVerdict && !recapFace ? parseFloat(this._completedScore) : NaN;
        const recapScore = Number.isFinite(recapScoreNum) ? {
            value: this._completedScore,
            icon: ['mdi:star-outline', 'mdi:star-half-full', 'mdi:star'][
                recapScoreNum >= 85 ? 2 : recapScoreNum >= 60 ? 1 : 0],
            color: ['red', 'amber', 'gold'][
                recapScoreNum >= 85 ? 2 : recapScoreNum >= 60 ? 1 : 0],
        } : null;

        // What the badge is coloured by: the harsher of what happened and how
        // it was judged. A session cut short is amber whatever face it wears,
        // and one judged badly is red even where the words only say it ended
        // early - "1 of 6 sextants" beside a red face reads as one verdict,
        // an amber sentence beside a red face as two that disagree.
        //
        // Only ever harsher: a friendly face must not paint an aborted
        // session green, because what the badge says first is what happened,
        // and that did not change.
        const TONE_RANK = { green: 0, gold: 0, muted: 0, amber: 1, red: 2 };
        const verdictTone = recapFace?.color ?? recapScore?.color ?? null;
        const badgeTone = Math.max(
            showAborted ? 1 : 0, TONE_RANK[verdictTone] ?? 0,
        );
        const badgeToneClass = ['', 'aborted', 'severe'][badgeTone];

        // Brush head type (issue #13): the type sensor carries the short
        // family name and the family letter (the A in "A3") as attributes —
        // one source for every head type. Integrations without them get the
        // full formatted enum text (two-line) and no compact letter. Hidden
        // while no head is attached (state unknown), matching the wear
        // reading.
        const headTypeState = entityIds.brushhead_type ? hass.states[entityIds.brushhead_type] : null;
        const headTypeAttrs = headTypeState?.attributes || {};
        const headTypeLabel = headTypeState
                && headTypeState.state !== 'unavailable' && headTypeState.state !== 'unknown'
            ? (headTypeAttrs.family_name
                || (hass.formatEntityState ? hass.formatEntityState(headTypeState) : headTypeState.state))
            : null;
        const headTypeWrap = headTypeLabel && !headTypeAttrs.family_name;
        const headTypeLetter = headTypeLabel ? headTypeAttrs.family_letter || null : null;

        // Shared brush-head glyph (chip icon and corner marker): the head
        // capsule in side view — bristles sticking out sideways, the typical
        // Sonicare silhouette. The fill steps in quarters instead of tracking
        // the exact percentage: at icon size a continuous fill is unreadable,
        // discrete jumps are not.
        // Head value display (issue #14): % remaining (default), % used, or
        // the integration's estimated sessions left. Sessions fall back to
        // remaining when the sensor is missing or unreadable; the glyph fill
        // and colour always follow wear.
        const headSessionsRaw = entityIds.brushhead_sessions
            ? parseInt(hass.states[entityIds.brushhead_sessions]?.state)
            : NaN;
        const headValue = config.head_display === 'used' && brushheadWear !== null
            ? `${Math.round(brushheadWear)}%`
            : config.head_display === 'sessions' && Number.isFinite(headSessionsRaw)
                ? `${headSessionsRaw}×`
                : `${brushheadPct}%`;
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
                        ${this._pressureBars(pressureClass)}
                        <span class="chip-label">${t(hass, 'chip_pressure')}</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>`;
                case 'intensity':
                    if (!intensityEntity) return '';
                    return html`<div class="chip" @click="${() => this._showMoreInfo(intensityEntity)}">
                        <div class="chip-icon ${intensityColor}">${this._intensityDial(intensity)}</div>
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
                        <div class="chip-value ${bhColor}">${headValue}</div>
                    </div>`;
                case 'head_type':
                    if (!headTypeLabel) return '';
                    // In the icon-only compact layout the family letter takes
                    // the icon's place, so the chip still tells the type.
                    return html`<div class="chip" @click="${() => this._showMoreInfo(entityIds.brushhead_type)}">
                        <div class="chip-icon ${headTypeLetter ? 'has-letter' : ''}">
                            <ha-icon icon="mdi:toothbrush"></ha-icon>
                            ${headTypeLetter ? html`<span class="head-type-letter">${headTypeLetter}</span>` : ''}
                        </div>
                        <span class="chip-label">${t(hass, 'chip_head_type')}</span>
                        <div class="chip-value prose ${headTypeWrap ? 'wrap' : ''}">${headTypeLabel}</div>
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
                    <span class="corner-val ${bhColor}">${headValue}</span>
                </div>`;
            }
            const marker = (entityId, icon, colorClass, label, value) => html`
                <div class="card-corner ${cls}" @click="${() => this._showMoreInfo(entityId)}">
                    <ha-icon class="corner-ico ${colorClass}" icon="${icon}"></ha-icon>
                    <span class="corner-lbl">${label}</span>
                    <span class="corner-val ${colorClass}">${value}</span>
                </div>`;
            // Same marker, but for the readings the card draws itself rather
            // than picking from MDI.
            const glyphMarker = (entityId, glyph, colorClass, label, value) => html`
                <div class="card-corner ${cls}" @click="${() => this._showMoreInfo(entityId)}">
                    <span class="corner-ico ${colorClass}">${glyph}</span>
                    <span class="corner-lbl">${label}</span>
                    <span class="corner-val ${colorClass}">${value}</span>
                </div>`;
            switch (prop) {
                case 'battery':
                    if (!entityIds.battery) return '';
                    return marker(entityIds.battery, batteryIconName, batteryColor, t(hass, 'chip_battery'), batteryUnavailable ? '–' : html`${batteryLevel}%`);
                case 'pressure':
                    if (!pressureEntity) return '';
                    return glyphMarker(pressureEntity, this._pressureBars(pressureClass),
                        pressureColor, t(hass, 'chip_pressure'), displayPressure);
                case 'intensity':
                    if (!intensityEntity) return '';
                    return glyphMarker(intensityEntity, this._intensityDial(intensity),
                        intensityColor, t(hass, 'chip_intensity'), displayIntensity);
                case 'mode':
                    if (!entityIds.mode && !entityIds.mode_select) return '';
                    return marker(entityIds.mode_select || entityIds.mode, modeIcon, modeUnavailable ? 'muted' : 'blue', t(hass, 'chip_mode'), modeLabel);
                case 'score':
                    if (!scoreAvailable) return '';
                    return marker(entityIds.score, scoreIcon, scoreColor, t(hass, 'chip_score'), scoreState);
                case 'head_type':
                    if (!headTypeLabel) return '';
                    // Fallback labels ride 'wrap' through the colorClass slot:
                    // two-line value, no color. Short labels fit as-is.
                    return marker(entityIds.brushhead_type, 'mdi:toothbrush', headTypeWrap ? 'wrap' : '', t(hass, 'chip_head_type'), headTypeLabel);
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
                            <title>${!btConnected ? t(hass, 'conn_bt_disconnected')
                                : viaCharger
                                    ? (btActive ? t(hass, 'conn_bt_charger_active')
                                        : t(hass, 'conn_bt_charger_connected'))
                                : btActive ? t(hass, 'conn_bt_active')
                                : t(hass, 'conn_bt_connected')}</title>
                            <path d="${!btConnected ? CONN_ICONS.bluetooth_off
                                : btActive ? CONN_ICONS.bluetooth_transfer
                                : CONN_ICONS.bluetooth}"/>
                        </svg>
                        ${hasCharger ? html`
                        <svg class="conn-icon ${viaCharger ? 'active' : ''}" viewBox="0 0 24 24" fill="currentColor"
                             @click="${() => this._showMoreInfo(entityIds.base_entity)}">
                            <title>${viaCharger ? t(hass, 'conn_via_charger') : t(hass, 'conn_charger_paired')}</title>
                            <path d="${CONN_ICONS.charger}"/>
                        </svg>` : ''}
                        ${entityIds.esp_bridge_alive ? html`
                        <svg class="conn-icon ${espConnected && btActive ? 'active' : ''} ${espConnected ? '' : 'disconnected'}"
                             viewBox="0 0 24 24" fill="currentColor"
                             @click="${() => this._showMoreInfo(entityIds.esp_bridge_alive)}">
                            <title>${!espConnected ? t(hass, 'conn_bridge_offline')
                                : btActive ? t(hass, 'conn_bridge_active')
                                : t(hass, 'conn_bridge_online')}</title>
                            <path d="${!espConnected ? CONN_ICONS.network_off
                                : btActive ? CONN_ICONS.network_active
                                : CONN_ICONS.network}"/>
                        </svg>` : ''}
                        <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                             @click="${() => this._showDeviceInfo()}">
                            <title>${t(hass, 'conn_device_info')}</title>
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

                    <div class="progress-wrap ${active || isSuccess || showAborted ? 'visible' : ''} ${config.progress_size === 'bold' ? 'bar-bold' : config.progress_size === 'xl' ? 'bar-xl' : ''}">
                        <div class="progress-track">
                            ${(() => {
                                // Same time-based fill as before, sliced into one
                                // sub-bar per step so the boundaries are visible -
                                // and each sub-bar as wide as its step is long, so
                                // an uneven routine would draw uneven segments.
                                let elapsedShare = 0;
                                return segmentSeconds.map((seconds) => {
                                    const start = elapsedShare / segmentTotal;
                                    elapsedShare += seconds;
                                    const end = elapsedShare / segmentTotal;
                                    const segPct = Math.max(0, Math.min(100,
                                        (progressPct / 100 - start) / (end - start) * 100));
                                    const fill = `width: ${segPct}%; background: linear-gradient(90deg, ${progressColorAt(start)}, ${progressColorAt(start + (end - start) * segPct / 100)})`;
                                    return html`<div class="progress-seg" style="flex-grow: ${seconds}">
                                        <div class="progress-fill" style="${fill}"></div>
                                    </div>`;
                                });
                            })()}
                        </div>
                        <div class="progress-labels">
                            <span>${sectorLabel || ''}</span>
                            <span>${recapTarget > 0 ? html`${this._formatTime(displayDuration)} / ${this._formatTime(recapTarget)}` : ''}</span>
                            <span>${progressPct}%</span>
                        </div>
                    </div>

                    ${topCornerEls}
                </div>

                <!-- Done badge -->
                <div class="done-badge ${isSuccess || showAborted ? 'show' : ''} ${badgeToneClass}">
                    ${showRecap ? html`
                    <button class="done-dismiss"
                            @click=${() => this._dismissHold()}>&times;</button>` : ''}
                    <div class="done-body ${recapFace || recapScore ? '' : 'text-only'}">
                        ${recapFace ? html`
                        <div class="done-face">
                            <svg class="done-smiley ${recapFace.color}" viewBox="0 0 24 24"
                                 fill="currentColor">
                                ${recapFace.code
                                    ? html`<title>${t(hass, 'smiley_unknown_hint')}</title>`
                                    : recapFace.computed
                                    ? html`<title>${t(hass, 'verdict_computed')}</title>` : ''}
                                <path d="${recapFace.path}"/>
                            </svg>
                            ${recapFace.code
                                ? html`<span class="done-face-code">${recapFace.code}</span>` : ''}
                        </div>` : recapScore ? html`
                        <div class="done-face">
                            <ha-icon class="done-score ${recapScore.color}"
                                     icon="${recapScore.icon}"></ha-icon>
                            <span class="done-face-value ${recapScore.color}">${recapScore.value}</span>
                        </div>` : ''}
                        <div class="done-text">
                            ${showAborted ? html`
                            <p><span title="${completedSourceLabel}">${t(hass, 'aborted_title')}</span>${completedAgo
                                ? html` <span class="done-age" title="${completedAtLabel}">(${completedAgo})</span>` : ''}</p>
                            <span>${t(hass, numSectors === 6 ? 'aborted_sextants' : 'aborted_quadrants')
                                .replace('{x}', Math.min(numSectors || 4, Math.floor(
                                    displayDuration / (recapTarget / (numSectors || 4)))))
                                .replace('{y}', numSectors || 4)}</span>` : html`
                            <p><span title="${completedSourceLabel}">&#10003; ${t(hass, 'done_title')}</span>${completedAgo
                                ? html` <span class="done-age" title="${completedAtLabel}">(${completedAgo})</span>` : ''}</p>
                            <span>${t(hass, numSectors === 6 ? 'done_sextants' : 'done_quadrants')}</span>`}
                        </div>
                    </div>
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
