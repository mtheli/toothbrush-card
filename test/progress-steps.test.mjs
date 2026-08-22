// The progress bar follows the routine's pacing, not the zone count.
//
// A step is one buzz of the handle. Sonicare's White+ and Gum Health
// revisit sectors, so they take eight and ten steps over six zones — and a
// bar divided into six put every boundary where nothing happens. The
// integration publishes the step lengths as `sector_times_seconds`; this
// covers the card reading them, and every device that publishes none
// keeping the old bar exactly as it was.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';

/** A brushing Sonicare, optionally publishing its step lengths. */
function sonicareHass({ duration = '42', routine = '200', sector = 'sector_3',
    steps, sectors = '6', attribute = 'step_times_seconds' } = {}) {
    const entity = (id, translation_key) => ({
        entity_id: id, device_id: 'dev1', platform: 'philips_sonicare_ble', translation_key,
    });
    return {
        language: 'en', locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', name: 'Sonicare', manufacturer: 'Philips', config_entries: ['ce1'] } },
        entities: {
            'sensor.s_state': entity('sensor.s_state', 'handle_state'),
            'sensor.s_time': entity('sensor.s_time', 'brushing_time'),
            'sensor.s_routine': entity('sensor.s_routine', 'routine_length'),
            'sensor.s_sector': entity('sensor.s_sector', 'sector'),
            'sensor.s_mode': entity('sensor.s_mode', 'brushing_mode'),
            'sensor.s_sectors': entity('sensor.s_sectors', 'number_of_sectors'),
        },
        states: {
            'sensor.s_state': { state: 'run', attributes: {}, last_changed: null },
            'sensor.s_time': { state: duration, attributes: {}, last_changed: null },
            'sensor.s_routine': { state: routine, attributes: {}, last_changed: null },
            'sensor.s_sector': { state: sector, attributes: {}, last_changed: null },
            'sensor.s_mode': {
                state: 'gum_care',
                attributes: steps === undefined ? {} : { [attribute]: steps },
                last_changed: null,
            },
            'sensor.s_sectors': { state: sectors, attributes: {}, last_changed: null },
        },
        callWS: async () => ({}),
    };
}

async function render(hass, config = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1',
        history_recap: false, ...config });
    el.hass = hass;
    return markup(el.render());
}

/** The `width: N%` of every sub-bar, in order. */
function fills(html) {
    return [...html.matchAll(/class="progress-fill"[^>]*width:\s*([\d.]+)%/g)]
        .map((m) => Number(m[1]));
}

const segCount = (html) => (html.match(/class="progress-seg"/g) || []).length;

describe('how many segments the bar has', () => {
    test('one per step where the routine says how it paces itself', async () => {
        // Gum Health: ten 20-second steps over six zones.
        const html = await render(sonicareHass({ steps: Array(10).fill(20) }));
        assert.equal(segCount(html), 10);
    });

    test('White+ gets its eight', async () => {
        const html = await render(sonicareHass({ routine: '160', steps: Array(8).fill(20) }));
        assert.equal(segCount(html), 8);
    });

    test('a routine without sectors is one undivided bar', async () => {
        // Tongue Care: the handle runs straight through, so the integration
        // reports a single step. Six segments would draw five boundaries
        // that never happen.
        const html = await render(sonicareHass({ routine: '60', duration: '20',
            sector: 'no_sector', steps: [60] }));
        assert.equal(segCount(html), 1);
        assert.deepEqual(fills(html), [33]);
    });

    test('a handle that publishes no steps keeps the zone count', async () => {
        const html = await render(sonicareHass());
        assert.equal(segCount(html), 6);
    });

    test('a null reading is not a list of steps', async () => {
        // oralb_live carries the field but leaves it null until the pacer
        // has been read; that must not empty the bar.
        const html = await render(sonicareHass({ steps: null }));
        assert.equal(segCount(html), 6);
    });

    test('nor is a list with a zero-length step in it', async () => {
        const html = await render(sonicareHass({ steps: [20, 0, 20] }));
        assert.equal(segCount(html), 6);
    });
});

describe('the other integration\'s name for the same thing', () => {
    test('oralb_live\'s per-zone list is read too', async () => {
        // Its zones never repeat (`supports_revisits: false`), so one time
        // per zone is one time per buzz there.
        const html = await render(sonicareHass({ routine: '120', duration: '0',
            steps: [30, 30, 30, 30], attribute: 'sector_times_seconds' }));
        assert.equal(segCount(html), 4);
    });

    test('a per-step list wins over a per-zone one', async () => {
        const Card = await loadCard();
        const el = new Card();
        el.requestUpdate = () => {};
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false });
        const hass = sonicareHass({ steps: Array(10).fill(20) });
        hass.states['sensor.s_sectors'].attributes = { sector_times_seconds: [33, 33, 33, 33, 33, 33] };
        el.hass = hass;
        assert.equal(segCount(markup(el.render())), 10);
    });
});

describe('where the fill stands', () => {
    test('42 s into Gum Health is a tenth into the third step', async () => {
        // 40 s of the routine are done at the third buzz, so two segments
        // are full and the third is 2 of its 20 seconds in.
        const html = await render(sonicareHass({ duration: '42', routine: '200',
            steps: Array(10).fill(20) }));
        const bars = fills(html);
        assert.equal(bars.length, 10);
        assert.deepEqual(bars.slice(0, 2), [100, 100]);
        assert.ok(bars[2] > 0 && bars[2] < 20, `third step barely started, got ${bars[2]}%`);
        assert.deepEqual(bars.slice(3), Array(7).fill(0));
    });

    test('the same moment on the old six-segment bar sat in the second', async () => {
        // What the handle showed and what the card drew disagreed by a
        // whole step: this is the bug, kept as its own case.
        const bars = fills(await render(sonicareHass({ duration: '42', routine: '200' })));
        assert.equal(bars.length, 6);
        assert.equal(bars[0], 100);
        assert.ok(bars[1] > 0 && bars[2] === 0, 'second of six, not third of ten');
    });

    test('a finished routine fills every step', async () => {
        const bars = fills(await render(sonicareHass({ duration: '200', routine: '200',
            steps: Array(10).fill(20) })));
        assert.deepEqual(bars, Array(10).fill(100));
    });
});

describe('uneven steps', () => {
    test('a longer step gets a wider segment', async () => {
        // No handle reports one today; the list is honoured as given so
        // that one would not need a new field.
        const html = await render(sonicareHass({ routine: '120', duration: '0',
            steps: [30, 60, 30] }));
        const grows = [...html.matchAll(/class="progress-seg" style="flex-grow:\s*([\d.]+)"/g)]
            .map((m) => Number(m[1]));
        assert.deepEqual(grows, [30, 60, 30]);
    });
});

describe('the recap keeps the routine that ran', () => {
    /** A Sonicare that has just finished a Gum Care session and been switched. */
    function afterGumCare({ recordSteps, modeNow = 'clean', modeSteps = Array(6).fill(20) } = {}) {
        const hass = sonicareHass({ duration: '0', routine: '120',
            sector: 'no_sector', steps: modeSteps });
        hass.states['sensor.s_state'].state = 'off';
        hass.states['sensor.s_mode'].state = modeNow;
        hass.entities['sensor.s_last'] = { entity_id: 'sensor.s_last', device_id: 'dev1',
            platform: 'philips_sonicare_ble', translation_key: 'last_session' };
        const startedAt = new Date(Date.now() - 100_000).toISOString();
        hass.states['sensor.s_last'] = {
            state: startedAt,
            attributes: {
                duration_seconds: 100,
                target_duration_seconds: 200,
                mode: 'gum_care',
                source: 'observed',
                time_source: 'session_end',
                ...(recordSteps === undefined ? {} : { step_times_seconds: recordSteps }),
            },
            last_changed: null,
        };
        return hass;
    }

    test('an aborted Gum Care session is drawn in its own ten steps', async () => {
        // The handle is on Clean now, whose bar has six segments - taking the
        // pacing from there would redraw the session as a different routine.
        const html = await render(afterGumCare({ recordSteps: Array(10).fill(20) }),
            { history_recap: false, hold_duration: 0 });
        assert.equal(segCount(html), 10);
    });

    test('without the record saying, the current mode is all there is', async () => {
        const html = await render(afterGumCare(), { history_recap: false, hold_duration: 0 });
        assert.equal(segCount(html), 6);
    });
});

describe('the recap is measured against the routine that ran', () => {
    test('switching mode afterwards does not rescale the bar', async () => {
        // Gum Care runs 3:20; Clean runs 2:00. A 38-second run that was cut
        // short is 19% of the routine it belonged to, not 32% of the one the
        // handle is set to a moment later.
        const hass = sonicareHass({ duration: '0', routine: '120',
            sector: 'no_sector', steps: Array(6).fill(20) });
        hass.states['sensor.s_state'].state = 'off';
        hass.states['sensor.s_mode'].state = 'clean';
        hass.entities['sensor.s_last'] = { entity_id: 'sensor.s_last', device_id: 'dev1',
            platform: 'philips_sonicare_ble', translation_key: 'last_session' };
        hass.states['sensor.s_last'] = {
            state: new Date(Date.now() - 60_000).toISOString(),
            attributes: {
                duration_seconds: 38,
                target_duration_seconds: 200,
                mode: 'gum_care',
                source: 'observed',
                time_source: 'session_end',
                step_times_seconds: Array(10).fill(20),
            },
            last_changed: null,
        };
        const html = await render(hass, { history_recap: false, hold_duration: 0 });
        assert.equal(segCount(html), 10, 'the session had ten steps');
        assert.match(html, /0:38 \/ 3:20/, 'against its own routine, not 2:00');
        assert.match(html, />19%</, '38 of 200 seconds');
    });
});
