// The Oral-B display face on its way into the done badge (issue #20).
//
// session-state.test.mjs proves the latch rule itself. This file proves the
// card wires it up: that the smiley sensor is found by its translation_key,
// that the face window is opened for the summary states the handle actually
// reports after a session, and that a device without the sensor is left
// exactly as it was.
//
// The registry is built inline, like xiaomi-render.test.mjs: there is no
// decoding to encode here, just three entities matched by translation_key.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';
import { smileyTier, SMILEY_TIERS } from '../src/icons.js';

/**
 * An oralb_live registry and its states.
 *
 * `smiley` of null omits the sensor entirely - the handles that predate it,
 * and every other integration.
 */
function oralbHass({ status = 'idle', duration = '0', smiley = 'off', sector,
    baseAttrs = {} } = {}) {
    const entity = (id, translation_key) => ({
        entity_id: id, device_id: 'dev1', platform: 'oralb_live', translation_key,
    });
    const entities = {
        'sensor.io_toothbrush_state': entity('sensor.io_toothbrush_state', 'toothbrush_state'),
        'sensor.io_brushing_time': entity('sensor.io_brushing_time', 'brushing_time'),
    };
    const states = {
        'sensor.io_toothbrush_state': { state: status, attributes: baseAttrs, last_changed: null },
        'sensor.io_brushing_time': { state: duration, attributes: {}, last_changed: null },
    };
    if (smiley !== null) {
        entities['sensor.io_smiley'] = entity('sensor.io_smiley', 'smiley');
        states['sensor.io_smiley'] = { state: smiley, attributes: {}, last_changed: null };
    }
    if (sector !== undefined) {
        entities['sensor.io_sector'] = entity('sensor.io_sector', 'sector');
        states['sensor.io_sector'] = {
            state: sector,
            attributes: {
                device_class: 'enum',
                options: ['no_sector', 'sector_1', 'sector_2', 'sector_3',
                    'sector_4', 'sector_5', 'sector_6'],
            },
            last_changed: null,
        };
    }
    return {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', name: 'Oral-B iO', manufacturer: 'Oral-B', config_entries: ['ce1'] } },
        entities,
        states,
        callWS: async () => ({}),
    };
}

async function oralbCard(config = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false, ...config,
    });
    return el;
}

/** Feed a sequence of readings through the card and return it. */
async function replay(readings, config = {}) {
    const el = await oralbCard(config);
    for (const reading of readings) {
        el.hass = oralbHass(reading);
        el.render();
    }
    return el;
}

describe('the face reaching the badge', () => {
    test('a face shown only in the summary state still lands', async () => {
        // The verdict is not on screen while the motor runs: the handle stops,
        // then switches to its summary state carrying the result. That state
        // is not "running", so it arrives after the recap has already latched.
        const el = await replay([
            { status: 'running', duration: '130', smiley: 'standard' },
            { status: 'post_brushing_summary', duration: '130', smiley: 'special_11' },
        ]);
        assert.equal(el._completed, true);
        assert.equal(el._completedFace, 'special_11');
    });

    test('session_summary opens the window too', async () => {
        const el = await replay([
            { status: 'running', duration: '130', smiley: 'standard' },
            { status: 'session_summary', duration: '130', smiley: 'special_10' },
        ]);
        assert.equal(el._completedFace, 'special_10');
    });

    test('a handle without the sensor leaves the badge alone', async () => {
        const el = await replay([
            { status: 'running', duration: '130', smiley: null },
            { status: 'idle', duration: '130', smiley: null },
        ]);
        assert.equal(el._completed, true, 'the recap itself is unaffected');
        assert.equal(el._completedFace, null);
    });

    test('a sleeping display is not a verdict', async () => {
        const el = await replay([
            { status: 'running', duration: '130', smiley: 'off' },
            { status: 'idle', duration: '130', smiley: 'off' },
        ]);
        assert.equal(el._completedFace, null);
    });

    test('the card still renders once a face is held', async () => {
        // Guards the badge markup: the face is drawn inside the recap, and a
        // template error there would only surface at render time.
        const el = await replay([
            { status: 'running', duration: '130', smiley: 'standard' },
            { status: 'post_brushing_summary', duration: '130', smiley: 'special_7' },
        ]);
        assert.doesNotThrow(() => el.render());
        assert.equal(el._completedFace, 'special_7');
    });
});

describe('switching the verdict off (show_verdict)', () => {
    const finished = [
        { status: 'running', duration: '130', smiley: 'standard' },
        { status: 'post_brushing_summary', duration: '130', smiley: 'special_11' },
    ];

    test('the face is drawn by default', async () => {
        const el = await replay(finished);
        assert.match(markup(el.render()), /done-smiley/,
            'the badge carries the verdict unless asked not to');
    });

    test('show_verdict: false leaves it out', async () => {
        const el = await replay(finished, { show_verdict: false });
        assert.doesNotMatch(markup(el.render()), /done-smiley/);
    });

    test('the recap itself stays', async () => {
        // Only the verdict glyph is configurable. Switching it off must not
        // take the finished session with it - the badge still says a session
        // ended, which is the part that is not a matter of taste.
        const el = await replay(finished, { show_verdict: false });
        assert.equal(el._completed, true);
        assert.equal(el._completedFace, 'special_11',
            'the latch keeps working, so switching the option back on needs no new session');
        assert.match(markup(el.render()), /done-badge/);
    });
});

describe('what a face value maps to', () => {
    test('the three decoded values carry a tier', () => {
        assert.equal(smileyTier('special_11'), SMILEY_TIERS.perfect);
        assert.equal(smileyTier('special_10'), SMILEY_TIERS.excellent);
        assert.equal(smileyTier('standard'), SMILEY_TIERS.good);
    });

    test('undecoded values ask instead of judging', () => {
        // The raw name travels with the tier so the badge can print it, which
        // is the whole point: a user can report what their handle showed.
        const tier = smileyTier('special_7');
        assert.equal(tier.code, 'special_7');
        assert.equal(tier.color, 'muted');
        assert.equal(tier.path, smileyTier('special_3').path,
            'every undecoded value uses the same question mark');
    });

    test('a value the integration has never reported still renders', () => {
        assert.equal(smileyTier('special_12').code, 'special_12');
    });

    test('nothing to show stays nothing', () => {
        assert.equal(smileyTier('off'), null);
        assert.equal(smileyTier(null), null);
        assert.equal(smileyTier(undefined), null);
    });

    test('no tier claims gold - that belongs to the score chip', () => {
        for (const [name, tier] of Object.entries(SMILEY_TIERS)) {
            assert.notEqual(tier.color, 'gold', `${name} must not use gold`);
        }
    });
});

describe('oralb_live sectors', () => {
    test('a repeated or lower reading is taken at face value, not advanced', async () => {
        // oralb_live decodes correctly on every release, so the pre-2026.8
        // workaround must never touch it: it would read a repeated or lower
        // sector after a reconnect as a wrap and advance past the real zone.
        const el = await oralbCard();
        const seen = [];
        const base = Object.getPrototypeOf(el)._getSectorData;
        el._getSectorData = function (sector, activeIndex, order, doneCount) {
            seen.push(activeIndex);
            return base.call(this, sector, activeIndex, order, doneCount);
        };
        for (const s of ['sector_2', 'sector_2', 'sector_1']) {
            el.hass = oralbHass({ status: 'running', duration: '45', sector: s });
            el.render();
        }
        assert.deepEqual(seen, [1, 1, 0], 'raw sectors rendered as-is');
    });
});

describe('the Bluetooth icon when the charger carries the data', () => {
    test('both icons tell the same story: brush -> charger -> home', async () => {
        // The handle's Bluetooth goes to the iO Sense, not to Home Assistant -
        // the same chain as brush -> ESP bridge, and the icons name it that
        // way: the BT icon points at the station, the station icon at us.
        const el = await replay([{
            status: 'charging',
            baseAttrs: { charger_address: 'AA:BB', data_source: 'charger_bridge' },
        }]);
        const text = markup(el.render());
        assert.match(text, /Live data over Bluetooth to the charging station/);
        assert.match(text, /Live data via the charging station/);
        assert.doesNotMatch(text, /Live data over Bluetooth</,
            'the HA-facing wording must not appear on the charger path');
    });
});
