// Oral-B counts a brush head down; every other handle counts it up.
//
// `oralb_live` reports what is left as days and as brushing hours, both
// absolute remainders. FF2D carries no lifetime total and no head type, so
// there is no honest percentage to derive and no fill height to draw - an
// empty capsule would read as a worn head, a full one as a fresh head.
//
// So the head slot takes a second shape: the same glyph without its fill, the
// chip label naming which counter is on screen, the value carrying the unit
// and the colour carrying the tier. This file holds that split apart, and
// guards the wear shape against being flattened along with it.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';

const DAYS = 'sensor.io_brush_head_remaining';
const HOURS = 'sensor.io_brush_head_brushing_time_remaining';

/**
 * An Oral-B handle whose refill counters are enabled.
 *
 * `days` / `hours` of null leave that sensor out; `state` sets the handle's
 * own refill_state attribute, which is `off` when the counter is not running.
 */
function oralbHass({ days = '41', hours = '4.98916666666667', state = 'on' } = {}) {
    const entity = (id, translation_key) => ({
        entity_id: id, device_id: 'dev1', platform: 'oralb_live', translation_key,
    });
    const entities = {
        'sensor.io_state': entity('sensor.io_state', 'toothbrush_state'),
        'sensor.io_time': entity('sensor.io_time', 'brushing_time'),
    };
    const states = {
        'sensor.io_state': { state: 'idle', attributes: {}, last_changed: null },
        'sensor.io_time': { state: '0', attributes: {}, last_changed: null },
    };
    if (days !== null) {
        entities[DAYS] = entity(DAYS, 'refill_days');
        states[DAYS] = {
            state: days,
            attributes: { unit_of_measurement: 'd', refill_state: state },
            last_changed: null,
        };
    }
    if (hours !== null) {
        entities[HOURS] = entity(HOURS, 'refill_brushing_time');
        states[HOURS] = {
            state: hours,
            attributes: { unit_of_measurement: 'h', refill_state: state },
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

/** A Sonicare handle, whose head reading is a wear percentage on a sub-device. */
function sonicareHass(wear = '79') {
    const entity = (id, translation_key, device_id = 'dev1') => ({
        entity_id: id, device_id, platform: 'philips_sonicare_ble', translation_key,
    });
    return {
        language: 'en',
        locale: { language: 'en' },
        devices: {
            dev1: { id: 'dev1', name: 'Prestige', manufacturer: 'Philips', config_entries: ['ce1'] },
            head: { id: 'head', name: 'Brush head', via_device_id: 'dev1', config_entries: ['ce1'] },
        },
        entities: {
            'sensor.s_handle': entity('sensor.s_handle', 'handle_state'),
            'sensor.s_time': entity('sensor.s_time', 'time'),
            'sensor.head_wear': entity('sensor.head_wear', 'brushhead_wear', 'head'),
        },
        states: {
            'sensor.s_handle': { state: 'idle', attributes: {}, last_changed: null },
            'sensor.s_time': { state: '0', attributes: { device_class: 'duration' }, last_changed: null },
            'sensor.head_wear': { state: wear, attributes: {}, last_changed: null },
        },
        callWS: async () => ({}),
    };
}

async function render(hass, config = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false, ...config,
    });
    el.hass = hass;
    return markup(el.render());
}

describe('the head slot on a handle that counts down', () => {
    test('shows the days, where every other handle shows a percentage', async () => {
        const text = await render(oralbHass());
        assert.match(text, /41 d/);
        assert.match(text, /Head · days/, 'the label names which counter this is');
        assert.doesNotMatch(text, /corner-val[^>]*>\s*\d+%/,
            'the head slot carries no percentage on this handle');
    });

    test('lands in the top-right corner without being configured', async () => {
        // The same default placement every other integration gets. Oral-B
        // needs no rule of its own - the slot is already there, it just fills
        // with a different reading.
        const text = await render(oralbHass());
        assert.match(text, /card-corner tr[\s\S]*?41 d/);
    });

    test('the capsule fills to the tier, not to a proportion', async () => {
        // There is no lifetime total to take a share of, so the height says
        // what the colour says and nothing more: three quarters, two, one.
        // Never full - that would read as a fresh head - and never empty,
        // which would read as a spent one.
        const clip = async (days) => {
            const text = await render(oralbHass({ days }));
            return text.match(/<rect x="0" y="([\d.]+)"/)?.[1];
        };
        assert.equal(await clip('41'), '7.5', 'three quarters at the top tier');
        assert.equal(await clip('9'), '15');
        assert.equal(await clip('2'), '22.5');
    });

    test('and it is painted in the tier colour', async () => {
        assert.match(await render(oralbHass({ days: '2' })), /fill="#dc2626"/);
        assert.match(await render(oralbHass({ days: '41' })), /fill="#16a34a"/);
    });

    test('but a wear reading keeps its fill', async () => {
        // The regression this file exists for: the countdown shape was added
        // by making the fill optional, and an optional fill is one refactor
        // away from never being drawn at all.
        const text = await render(sonicareHass('79'));
        assert.match(text, /21%/);
        assert.match(text, /fill="#d97706"/, 'the amber fill, at 21% left');
        assert.doesNotMatch(text, /Head · days/);
    });
});

describe('how the two counters are written', () => {
    test('hours keep one decimal while it still says something', async () => {
        const text = await render(oralbHass(), { layout: { corners: { top_left: 'head_time' } } });
        assert.match(text, /5\.0 h/, '4.98916666666667 rounded to one decimal');
    });

    test('and lose it once they do not', async () => {
        const text = await render(oralbHass({ hours: '12.34' }),
            { layout: { corners: { top_left: 'head_time' } } });
        assert.match(text, /12 h/);
        assert.doesNotMatch(text, /12\.3/);
    });

    test('days are whole', async () => {
        const text = await render(oralbHass({ days: '40.6' }));
        assert.match(text, /41 d/);
    });
});

describe('how urgent it is', () => {
    const tier = async (days) => {
        const text = await render(oralbHass({ days }));
        return text.match(/corner-val (\w+)">\s*\d+ d/)?.[1];
    };

    test('the tier steps on what is left, not on a share of anything', async () => {
        assert.equal(await tier('41'), 'green');
        assert.equal(await tier('14'), 'amber');
        assert.equal(await tier('3'), 'amber');
        assert.equal(await tier('2'), 'red');
    });
});

describe('a counter the handle is not running', () => {
    test('refill_state: off leaves the slot empty', async () => {
        // The handle can switch the reminder off, and then the number stands
        // still. A frozen count is worse than none: it reads as a countdown
        // that has stopped mattering.
        const text = await render(oralbHass({ state: 'off' }));
        assert.doesNotMatch(text, /41 d/);
        assert.doesNotMatch(text, /Head · days/);
    });

    test('so does a reading the integration cannot fill in', async () => {
        const hass = oralbHass();
        hass.states[DAYS].state = 'unknown';
        assert.doesNotMatch(await render(hass), /Head · days/);
    });
});

describe('the brushing-time counter', () => {
    test('is not placed on its own', async () => {
        // Two readings for one brush head would fill the card with the same
        // thing twice. Days by default, because that is what people plan by.
        const text = await render(oralbHass());
        assert.doesNotMatch(text, /Head · time/);
    });

    test('but can be placed', async () => {
        const text = await render(oralbHass(), { layout: { corners: { top_left: 'head_time' } } });
        assert.match(text, /Head · time/);
        assert.match(text, /5\.0 h/);
    });

    test('and is offered nowhere on a handle without it', async () => {
        const text = await render(sonicareHass(), { layout: { corners: { top_left: 'head_time' } } });
        assert.doesNotMatch(text, /Head · time/);
    });
});
