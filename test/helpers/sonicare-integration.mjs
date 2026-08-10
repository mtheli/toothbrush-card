// Stands in for the Home Assistant Philips Sonicare integration
// (philips_sonicare_ble) on top of a recorded session.
//
// Unlike Oral-B there is nothing broadcast to sniff: a Sonicare handle is
// connection-oriented, so a session is recorded by subscribing to its GATT
// characteristics. `scripts/sonicare_session_record.py` in the integration
// repo writes that recording as JSONL - one line per changed characteristic,
// with a timestamp. This helper decodes those raw values the way the
// integration does and publishes the entity states that follow, so the card
// sees exactly what a real install would show it.
//
// Decoding and the entity mapping are transcribed from
// https://github.com/mtheli/philips_sonicare_ble:
//   custom_components/philips_sonicare_ble/classic_protocol.py (uint16 LE for
//   the counters, single state bytes for the rest)
//   custom_components/philips_sonicare_ble/const.py (HANDLE_STATES,
//   BRUSHING_STATES, MODE_SECTOR_SEQUENCES, current_sector)
//   custom_components/philips_sonicare_ble/sensor.py (SonicareSectorSensor)
//
// The sector is the part that matters most here: the handle does not report
// one. The integration derives it from elapsed time, the routine length and a
// mode-specific visit sequence - and it is that sequence which makes White+
// and Gum Health revisit sectors the card has already marked done.

import { readFileSync } from 'node:fs';

const HANDLE_STATES = {
    0: 'off', 1: 'standby', 2: 'run', 3: 'charge',
    4: 'shutdown', 6: 'validate', 7: 'background',
};

const BRUSHING_STATES = {
    0: 'off', 1: 'on', 2: 'pause', 3: 'session_complete', 4: 'session_aborted',
};

const BRUSHING_MODES = ['clean', 'white_plus', 'gum_health', 'deep_clean_plus',
    'tongue_care', 'sensitive'];

const INTENSITIES = ['low', 'medium', 'high'];

// 1-indexed anatomical sectors. White+ and Gum Health revisit the front-teeth
// sectors after the initial sweep - the reason the card has a Sonicare-only
// revisit branch at all.
const MODE_SECTOR_SEQUENCES = {
    clean: [1, 2, 3, 4, 5, 6],
    white_plus: [1, 2, 3, 4, 5, 6, 2, 5],
    gum_health: [1, 2, 3, 4, 5, 6, 1, 3, 4, 6],
    deep_clean_plus: [1, 2, 3, 4, 5, 6],
    sensitive: [1, 2, 3, 4, 5, 6],
    tongue_care: [],
};

const uint16 = (hex) => parseInt(hex.slice(2, 4) + hex.slice(0, 2), 16);
const uint8 = (hex) => parseInt(hex.slice(0, 2), 16);

/** Sectors a model is divided into: only the Kids line uses four. */
export function sectorsForModel(model) {
    return (model || '').toUpperCase().startsWith('HX63') ? 4 : 6;
}

/**
 * The 1-indexed sector at `elapsed` seconds, or null when there is none.
 * Mirrors const.current_sector, including its fallbacks: Kids and unknown
 * modes spread uniformly, Tongue Care has no sectors at all.
 */
export function currentSector(model, mode, elapsed, routineLength) {
    if (elapsed == null || routineLength == null || routineLength <= 0) return null;
    const total = sectorsForModel(model);
    const isKids = (model || '').toUpperCase().startsWith('HX63');
    const seq = isKids ? undefined : MODE_SECTOR_SEQUENCES[mode || ''];
    if (seq !== undefined && seq.length === 0) return null;
    if (seq === undefined) {
        const perSector = routineLength / total;
        return Math.min(total, Math.floor(elapsed / perSector) + 1);
    }
    const perStep = routineLength / seq.length;
    return seq[Math.min(seq.length - 1, Math.floor(elapsed / perStep))];
}

/** Read a recording: `{ meta, events }`, events in chronological order. */
export function loadSession(url) {
    const lines = readFileSync(url, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    const meta = lines[0]?.kind === 'meta' ? lines[0] : {};
    return { meta, events: lines.filter(row => row.kind !== 'meta') };
}

const DEVICE = {
    id: 'dev1',
    name: 'Philips Sonicare',
    manufacturer: 'Philips',
    config_entries: ['ce1'],
};

// The entities the integration creates for a premium Classic handle, limited
// to the ones the card looks for. Sub-device entities (brush head, connection)
// are left out: this recording carries no brush-head values, and inventing
// them would test the fixture rather than the card.
const ENTITIES = [
    ['sensor.sonicare_handle_state', 'handle_state'],
    ['sensor.sonicare_brushing_time', 'brushing_time'],
    ['sensor.sonicare_routine_length', 'routine_length'],
    ['sensor.sonicare_brushing_mode', 'brushing_mode'],
    ['sensor.sonicare_intensity', 'intensity'],
    ['sensor.sonicare_sector', 'sector'],
    ['sensor.sonicare_number_of_sectors', 'number_of_sectors'],
    ['sensor.sonicare_model_number', 'model_number'],
];

/**
 * Fold the recording up to `t` seconds into the coordinator data the
 * integration would hold at that moment.
 */
export function stateAt(session, t) {
    const raw = {};
    for (const event of session.events) {
        if (event.t > t) break;
        raw[event.char] = event.hex;
    }
    const handleStateValue = raw.handle_state !== undefined ? uint8(raw.handle_state) : null;
    const brushingStateValue = raw.brushing_state !== undefined ? uint8(raw.brushing_state) : null;
    return {
        handle_state: handleStateValue !== null ? HANDLE_STATES[handleStateValue] : null,
        handle_state_value: handleStateValue,
        brushing_state: brushingStateValue !== null ? BRUSHING_STATES[brushingStateValue] : null,
        brushing_time: raw.brushing_time !== undefined ? uint16(raw.brushing_time) : null,
        routine_length: raw.routine_length !== undefined ? uint16(raw.routine_length) : null,
        brushing_mode: raw.brushing_mode !== undefined
            ? BRUSHING_MODES[uint8(raw.brushing_mode)] ?? null : null,
        intensity: raw.intensity !== undefined
            ? INTENSITIES[uint8(raw.intensity)] ?? null : null,
    };
}

/** The sector sensor's state for a given coordinator snapshot. */
export function sectorState(data, model) {
    const brushing = data.brushing_state === 'on' || data.handle_state_value === 2;
    const { brushing_time: elapsed, routine_length: routine } = data;
    if (!brushing || elapsed == null || elapsed <= 0) return 'no_sector';
    if (routine == null || routine <= 0) return 'no_sector';
    if (elapsed >= routine) return 'success';
    const sector = currentSector(model, data.brushing_mode, elapsed, routine);
    return sector === null ? 'no_sector' : `sector_${sector}`;
}

/** A `hass` object as the card would receive it at that point in the session. */
export function sonicareHass(session, t, isoTime) {
    const model = session.meta.model || '';
    const data = stateAt(session, t);
    const values = {
        handle_state: data.handle_state ?? 'unknown',
        brushing_time: data.brushing_time ?? 'unknown',
        routine_length: data.routine_length ?? 'unknown',
        brushing_mode: data.brushing_mode ?? 'unknown',
        intensity: data.intensity ?? 'unknown',
        sector: sectorState(data, model),
        number_of_sectors: String(sectorsForModel(model)),
        model_number: model,
    };

    const entities = {};
    const states = {};
    for (const [entityId, key] of ENTITIES) {
        entities[entityId] = {
            entity_id: entityId,
            device_id: 'dev1',
            platform: 'philips_sonicare_ble',
            translation_key: key,
        };
        states[entityId] = {
            state: String(values[key]),
            attributes: key === 'brushing_time' ? { device_class: 'duration' } : {},
            last_changed: isoTime,
        };
    }

    return {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: DEVICE },
        entities,
        states,
        // The card's history recap is disabled in these tests.
        callWS: async () => ({}),
    };
}

/**
 * Replay a recording through the card, one render per recorded event.
 *
 * Returns a row per event with the card's own reading of it, captured by
 * wrapping `_getSectorData` and `_getSectorLabel` - the same approach the
 * Oral-B replay uses, so nothing has to be parsed out of a lit template.
 */
export async function replaySession(Card, session, { config = {}, now } = {}) {
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1',
        history_recap: false, ...config,
    });

    let current = null;
    const baseData = Object.getPrototypeOf(el)._getSectorData;
    const baseLabel = Object.getPrototypeOf(el)._getSectorLabel;
    el._getSectorData = function (sector, activeIndex, sectorOrder, doneCount = null) {
        const zones = baseData.call(this, sector, activeIndex, sectorOrder, doneCount);
        current = {
            sector,
            activeIndex,
            zoneCount: sectorOrder.length,
            done: Object.values(zones).filter(z => z.done).length,
            brushing: Object.values(zones).filter(z => z.brushing).length,
        };
        return zones;
    };
    el._getSectorLabel = function (sector, activeIndex, sectorOrder) {
        const label = baseLabel.call(this, sector, activeIndex, sectorOrder);
        if (current) current.label = label;
        return label;
    };

    // The recording is relative to its own start; anchor it to `now` so the
    // card's clock arithmetic (the completion hold) lines up with it.
    const base = now ?? Date.now();
    const rows = [];
    for (const event of session.events) {
        current = null;
        const iso = new Date(base + event.t * 1000).toISOString();
        el.hass = sonicareHass(session, event.t, iso);
        el.render();
        rows.push({ t: event.t, char: event.char, data: stateAt(session, event.t), card: current });
    }
    return { el, rows };
}
