// What the card makes of the entities laifen_ble publishes.
//
// The interesting case is the routine length. laifen_ble 3.0.3 dropped the
// Brushing Time sensor on the Wave and left the Brushing Duration sensor
// registered but permanently unavailable there, so the only source left is the
// number entity the release added - in minutes, where the sensor counts
// seconds. Getting that wrong is invisible in the UI: the card just falls back
// to its two-minute default and the recap banner stays away, which is what the
// Wave did before 3.0.3 anyway.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { laifenHass } from './helpers/laifen-integration.mjs';

/** The entity mapping the card derives for a given install. */
async function mapping(options) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false });
    return el._findAndMapEntitiesInConfig(laifenHass(options), 'dev1');
}

/**
 * The routine length the card actually brushes against, in seconds.
 *
 * It is not returned anywhere, so the card is rendered mid-session and the
 * routine it snapshotted for that session is read back - the same value the
 * completion check uses when the session ends.
 */
async function routineLength(options) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false });
    el.hass = laifenHass({ ...options, status: 'Running', timer: 42 });
    el.render();
    return el._sessionRoutineLength;
}

describe('laifen_ble 3.0.3 entity mapping', () => {
    test('the Wave takes its routine from the number entity', async () => {
        const ids = await mapping({ model: 'wave', routineMinutes: 3 });

        // The sensor is still registered, so it is still mapped - it just never
        // reads, which is why the number has to stand beside it.
        assert.equal(ids.routine_length, 'sensor.laifen_toothbrush_brushing_duration');
        assert.equal(ids.routine_length_number,
            'number.laifen_toothbrush_brushing_duration_adjustment');
        assert.equal(await routineLength({ model: 'wave', routineMinutes: 3 }), 180);
    });

    test('the Wave Pro keeps reading its routine from the sensor', async () => {
        const ids = await mapping({ model: 'wave-pro', routineMinutes: 3 });

        assert.equal(ids.routine_length, 'sensor.laifen_toothbrush_brushing_duration');
        // Seconds from the sensor, not minutes from the number - a unit mix-up
        // would show up as 10800 here.
        assert.equal(await routineLength({ model: 'wave-pro', routineMinutes: 3 }), 180);
    });

    test('an unset duration falls back to the default', async () => {
        // Neither handle reports the duration back, so the number reads
        // "unknown" until it has been set once.
        assert.equal(await routineLength({ model: 'wave', routineMinutes: null }), 120);
    });

    test('a German install is matched by translation_key, not by entity_id', async () => {
        const ids = await mapping({ model: 'wave', language: 'de', routineMinutes: 2.5 });

        // The main state entity ends up as base_entity, not status.
        assert.equal(ids.base_entity, 'sensor.laifen_toothbrush_status');
        assert.equal(ids.duration, 'sensor.laifen_toothbrush_timer');
        assert.equal(ids.mode_select, 'select.laifen_toothbrush_modus');
        assert.equal(ids.pacer_30s, 'switch.laifen_toothbrush_30_sekunden_erinnerung');
        assert.equal(ids.ble_connected, 'binary_sensor.laifen_toothbrush_verbindung');
        assert.equal(ids.routine_length_number,
            'number.laifen_toothbrush_putzdauer_einstellen');
        assert.equal(await routineLength({ model: 'wave', language: 'de', routineMinutes: 2.5 }), 150);
    });

    test('the over-pressure sensor is only mapped for the Wave Pro', async () => {
        const wave = await mapping({ model: 'wave' });
        const pro = await mapping({ model: 'wave-pro' });

        assert.equal(wave.pressure, null);
        assert.equal(pro.pressure, 'binary_sensor.laifen_toothbrush_pressing_too_hard');
    });
});

describe('laifen_ble 3.0.2 entity mapping', () => {
    test('entities without translation_keys are still matched by entity_id', async () => {
        const ids = await mapping({ release: '3.0.2', model: 'wave-pro', routineMinutes: 3 });

        assert.equal(ids.base_entity, 'sensor.laifen_toothbrush_status');
        assert.equal(ids.duration, 'sensor.laifen_toothbrush_timer');
        assert.equal(ids.mode_select, 'select.laifen_toothbrush_mode');
        assert.equal(ids.mode, 'sensor.laifen_toothbrush_mode');
        assert.equal(ids.pressure, 'binary_sensor.laifen_toothbrush_pressing_too_hard');
        assert.equal(ids.routine_length, 'sensor.laifen_toothbrush_brushing_duration');
        assert.equal(await routineLength({ release: '3.0.2', model: 'wave-pro', routineMinutes: 3 }), 180);
    });

    test('the Wave read a constant zero and fell back to the default', async () => {
        const ids = await mapping({ release: '3.0.2', model: 'wave' });

        // Brushing Time was the only routine source on the V1 back then, and it
        // reported 0 - which is why 3.0.3 removed it.
        assert.equal(ids.routine_length, 'sensor.laifen_toothbrush_brushing_duration');
        assert.equal(await routineLength({ release: '3.0.2', model: 'wave' }), 120);
    });
});

describe('the routine length from recorder history', () => {
    test('number rows are read as minutes, sensor rows as seconds', async () => {
        const Card = await loadCard();
        const el = new Card();
        const rows = [
            { s: '2.0', lu: 1000 },
            { s: '3.0', lu: 2000 },
            { s: 'unavailable', lu: 4000 },
        ];

        // The session ended at 3000: the 3-minute setting was in force, the
        // later unavailable row must not wipe it.
        assert.equal(el._routineAtFromHistory(rows, 3000 * 1000, true), 180);
        assert.equal(el._routineAtFromHistory(rows, 3000 * 1000, false), 3);
        // A setting written only after the session says nothing about it.
        assert.equal(el._routineAtFromHistory(rows, 500 * 1000, true), 0);
    });
});

describe('the strength reading', () => {
    test('is mapped as the intensity chip', async () => {
        const ids = await mapping({ strength: 7 });
        assert.match(ids.intensity, /_strength$/,
            'from the read-only sensor, not the number that sets it');
    });

    test('is not confused with the number entity beside it', async () => {
        // "Vibration Strength" also ends in _strength; only the sensor counts.
        const ids = await mapping({ strength: 7 });
        assert.ok(ids.intensity.startsWith('sensor.'),
            `expected a sensor, got ${ids.intensity}`);
    });

    test('is mapped even where the handle never reports one', async () => {
        // laifen_ble registers every sensor on every device and gates them
        // through `available`, the same way it does with Brushing Duration.
        // So the entity is always there and the mapping always finds it - what
        // differs is whether it ever carries a value.
        const ids = await mapping({});
        assert.match(ids.intensity, /_strength$/);
    });
});

describe('grading a numeric strength for the chip', () => {
    /** The level the card reduces a reading to, for icon and colour. */
    async function level(value) {
        const Card = await loadCard();
        return new Card()._intensityLevel(value);
    }

    test('spans the ordinary 1-10 scale', async () => {
        assert.equal(await level(1), 'low');
        assert.equal(await level(3), 'low');
        assert.equal(await level(5), 'medium');
        assert.equal(await level(8), 'high');
        assert.equal(await level(10), 'high');
    });

    test('and the high-frequency 11-20 one, without being told which', async () => {
        // The value says which scale it is on, so mode 4 never has to be read.
        assert.equal(await level(11), 'low');
        assert.equal(await level(15), 'medium');
        assert.equal(await level(20), 'high');
    });

    test('11 is the bottom of its scale, not the top of the other', async () => {
        assert.notEqual(await level(11), 'high',
            'grading 11 against 1-10 would read as maximum strength');
    });

    test('named levels are passed through untouched', async () => {
        for (const named of ['low', 'medium', 'high', 'HIGH']) {
            assert.equal(await level(named), named.toLowerCase());
        }
    });

    test('anything unreadable stays neutral rather than guessing', async () => {
        for (const value of ['unavailable', 'unknown', '', 'N/A', 0, -1]) {
            assert.equal(await level(value), null, String(value));
        }
    });
});
