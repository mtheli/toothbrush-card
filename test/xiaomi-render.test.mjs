// What the card makes of a Xiaomi handle.
//
// Xiaomi diverges from every other supported integration at render time, and
// each difference is a branch that exists only for it:
//
//   * the main entity is binary and reports plain on/off, not a named state
//   * there is no duration entity at all - the broadcast carries no live
//     timer, so the session time is how long the state entity has been on
//   * the head sensor reports the percentage *left*, while the card tracks
//     wear, so the reading is inverted
//   * with neither contact feedback nor a mode, the default chip row would be
//     a lone battery chip, so a different one is substituted
//
// The registry is built inline rather than in a helper: unlike laifen_ble and
// philips_sonicare_ble there is nothing to encode here - no decoding, no
// release differences - just four entities matched by the suffixes the card
// looks for.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import {
    findDeviceEntities, normalizeLayout, resolveLayoutForDevice,
} from '../src/toothbrush-card.js';

const NOW = new Date('2026-08-10T07:30:00Z');

/**
 * A Xiaomi registry and its states.
 *
 * `activeSince` is when the handle switched on, in seconds before now - the
 * only source of a session time here.
 */
function xiaomiHass({ on = false, activeSince = 0, score = '92', consumable = '80',
    battery = '75' } = {}) {
    const entity = (id) => ({
        entity_id: id, device_id: 'dev1', platform: 'xiaomi_ble',
    });
    const lastChanged = new Date(Date.now() - activeSince * 1000).toISOString();
    return {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', name: 'Mi Smart Toothbrush', manufacturer: 'Xiaomi', config_entries: ['ce1'] } },
        entities: {
            'binary_sensor.mi_toothbrush': entity('binary_sensor.mi_toothbrush'),
            'sensor.mi_score': entity('sensor.mi_score'),
            'sensor.mi_consumable': entity('sensor.mi_consumable'),
            'sensor.mi_battery': entity('sensor.mi_battery'),
        },
        states: {
            'binary_sensor.mi_toothbrush': {
                state: on ? 'on' : 'off', attributes: {}, last_changed: lastChanged,
            },
            'sensor.mi_score': { state: score, attributes: {}, last_changed: lastChanged },
            'sensor.mi_consumable': { state: consumable, attributes: {}, last_changed: lastChanged },
            'sensor.mi_battery': {
                state: battery, attributes: { device_class: 'battery' }, last_changed: lastChanged,
            },
        },
        callWS: async () => ({}),
    };
}

/** A card wired to that device, with the readings it computed captured. */
async function xiaomiCard(config = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1',
        history_recap: false, ...config,
    });

    const seen = {};
    const proto = Object.getPrototypeOf(el);
    const baseSector = proto._getSectorData;
    const baseWear = proto._getBrushheadColor;
    el._getSectorData = function (sector, activeIndex, sectorOrder, doneCount = null) {
        seen.sector = sector;
        seen.activeIndex = activeIndex;
        seen.zoneCount = sectorOrder.length;
        return baseSector.call(this, sector, activeIndex, sectorOrder, doneCount);
    };
    el._getBrushheadColor = function (wear) {
        seen.wear = wear;
        return baseWear.call(this, wear);
    };
    return { el, seen };
}

describe('the binary main entity', () => {
    test('on reads as running and off as idle', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el, seen } = await xiaomiCard();

        el.hass = xiaomiHass({ on: true, activeSince: 45 });
        el.render();
        assert.equal(seen.activeIndex >= 0, true, 'a zone is highlighted while running');

        el.hass = xiaomiHass({ on: false });
        el.render();
        assert.equal(seen.sector, 'no_sector');
    });
});

describe('the session time, with no duration entity to read', () => {
    test('is how long the handle has been on', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el } = await xiaomiCard();
        el.hass = xiaomiHass({ on: true, activeSince: 45 });
        el.render();
        // Not exposed directly, so it is read back through the completion
        // latch: ending the session latches the peak duration observed.
        el.hass = xiaomiHass({ on: false });
        el.render();
        assert.equal(el._completedDuration, 45);
    });

    test('keeps ticking as the clock advances, without a state change', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el, seen } = await xiaomiCard();
        const switchedOnAt = Date.now();
        const running = () => {
            const hass = xiaomiHass({ on: true });
            hass.states['binary_sensor.mi_toothbrush'].last_changed =
                new Date(switchedOnAt).toISOString();
            return hass;
        };

        el.hass = running();
        el.render();
        const firstZone = seen.activeIndex;

        // 70 s later the same state entity, untouched, must have moved the
        // card on - the 1 s refresh interval is what drives this in the app.
        t.mock.timers.tick(70_000);
        el.hass = running();
        el.render();
        assert.ok(seen.activeIndex > firstZone,
            `expected a later zone than ${firstZone}, got ${seen.activeIndex}`);
    });

    test('a full two minutes counts as a completed session', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el } = await xiaomiCard();
        el.hass = xiaomiHass({ on: true, activeSince: 125 });
        el.render();
        el.hass = xiaomiHass({ on: false });
        el.render();
        assert.equal(el._completed, true);
        assert.equal(el._completedIsFull, true,
            '125 s clears the 2-minute default the card falls back to');
    });
});

describe('sectors derived from time alone', () => {
    test('a handle with no sector entity gets four zones on the default routine', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el, seen } = await xiaomiCard();
        el.hass = xiaomiHass({ on: true, activeSince: 45 });
        el.render();
        assert.equal(seen.zoneCount, 4);
        // 120 s over four zones is 30 s each, so 45 s is the second.
        assert.equal(seen.activeIndex, 1);
    });
});

describe('the head reading', () => {
    // The direction is not a guess. The sensor comes from MiBeacon object
    // 0x1013, "Remaining amount of consumables", whose payload is defined as
    // "Remaining percentage, range 0~100". xiaomi_ble's parser passes the byte
    // through under the name "Consumable (in percent)" without saying which
    // way it runs, so the protocol definition is the source here - the card
    // originally inverted it on an assumption that a user's screenshots never
    // explicitly confirmed.
    test('is inverted, because Xiaomi reports what is left', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el, seen } = await xiaomiCard();
        el.hass = xiaomiHass({ on: false, consumable: '80' });
        el.render();
        assert.equal(seen.wear, 20, '80% left is 20% worn');
    });

    test('a brand-new head is not mistaken for a worn-out one', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el, seen } = await xiaomiCard();
        el.hass = xiaomiHass({ on: false, consumable: '100' });
        el.render();
        assert.equal(seen.wear, 0);
    });
});

describe('the chip row', () => {
    test('a device with neither contact feedback nor a mode gets its own default', () => {
        // Checked from a real registry rather than a hand-built id map: the
        // substitution depends on what findDeviceEntities actually resolves
        // for a Xiaomi device, which is the part that could drift.
        const ids = findDeviceEntities(xiaomiHass(), 'dev1');
        assert.equal(ids.pressure, null);
        assert.equal(ids.intensity, null);
        assert.equal(ids.mode, null);
        assert.equal(ids.score, 'sensor.mi_score');

        const layout = resolveLayoutForDevice(normalizeLayout({}), ids);
        assert.deepEqual(layout.chips, ['battery', 'score', 'brush_head'],
            'rather than the lone battery chip the classic default would give');
    });
});

describe('the score on the finished-session badge', () => {
    test('is the one from the session that just ended', async (t) => {
        // Xiaomi reports a score only when the handle switches off, so the
        // number the sensor carries during a session belongs to the previous
        // one. Latching it at the end is what makes the badge honest.
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el } = await xiaomiCard();

        el.hass = xiaomiHass({ on: true, activeSince: 125, score: '61' });
        el.render();
        el.hass = xiaomiHass({ on: false, score: '88' });
        el.render();

        assert.equal(el._completed, true);
        assert.equal(el._completedScore, '88', 'the score of this session, not the one before');
    });

    test('goes away when the next session starts', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: NOW });
        const { el } = await xiaomiCard();
        el.hass = xiaomiHass({ on: true, activeSince: 125, score: '61' });
        el.render();
        el.hass = xiaomiHass({ on: false, score: '88' });
        el.render();
        assert.equal(el._completedScore, '88');

        el.hass = xiaomiHass({ on: true, activeSince: 2, score: '88' });
        el.render();
        assert.equal(el._completedScore, null,
            'the badge cannot describe a session that has not finished');
    });
});
