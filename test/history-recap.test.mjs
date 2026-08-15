// Rebuilding the last session from recorder history (issues #11 and #18).
//
// The card normally latches a finished session by watching it end. That fails
// whenever the card was not looking: a dashboard opened after brushing, or a
// handle that wipes its counters seconds after powering off - Oral-B does
// exactly that, so the current state often proves nothing at all. The recap is
// then rebuilt from one recorder query.
//
// Every other test in this suite disables the feature (`history_recap: false`)
// so it cannot interfere; this file is where it is switched on.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';

const MINUTE = 60_000;
const START = new Date('2026-08-10T07:00:00Z');

/** A history row in the WebSocket's compressed form (state / last_updated). */
const ws = (state, epochSeconds) => ({ s: String(state), lu: epochSeconds });
/** The same row REST-style, which the parser also has to accept. */
const rest = (state, epochSeconds) => ({
    state: String(state), last_updated: new Date(epochSeconds * 1000).toISOString(),
});

/** A card bound to an Oral-B-shaped device that is idle with wiped counters. */
async function idleCard(config = {},
    { duration = '0', routineLength = null, withSector = true } = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};

    // A sector entity is not decoration here: without one the card falls back
    // to synthesising a 2-minute routine from time (see the `entityIds.sector`
    // branch in render), and the "no target, no recap" guard could never
    // trigger. Every Oral-B has one.
    const entities = {
        'sensor.io_state': {
            entity_id: 'sensor.io_state', device_id: 'dev1', platform: 'oralb',
            translation_key: 'toothbrush_state',
        },
        'sensor.io_time': {
            entity_id: 'sensor.io_time', device_id: 'dev1', platform: 'oralb',
            translation_key: 'time',
        },
        'sensor.io_sector': {
            entity_id: 'sensor.io_sector', device_id: 'dev1', platform: 'oralb',
            translation_key: 'sector',
        },
    };
    // Sonicare-shaped when false: a routine entity but no sector entity, so
    // the live routineLength falls back to the 2-minute default — which the
    // history rebuild must not adopt as a measuring stick.
    if (!withSector) delete entities['sensor.io_sector'];
    const states = {
        'sensor.io_state': { state: 'idle', attributes: {}, last_changed: START.toISOString() },
        'sensor.io_time': {
            state: duration, attributes: { device_class: 'duration' },
            last_changed: START.toISOString(),
        },
        'sensor.io_sector': {
            state: 'no_sector', attributes: {}, last_changed: START.toISOString(),
        },
    };
    if (routineLength !== null) {
        entities['sensor.io_routine'] = {
            entity_id: 'sensor.io_routine', device_id: 'dev1', platform: 'oralb',
            translation_key: 'routine_length',
        };
        states['sensor.io_routine'] = {
            state: routineLength, attributes: {}, last_changed: START.toISOString(),
        };
    }

    const calls = [];
    const hass = {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', name: 'IO', manufacturer: 'Oral-B', config_entries: ['ce1'] } },
        entities,
        states,
        callWS: async (msg) => { calls.push(msg); return hass.__response ?? {}; },
    };
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', ...config });
    return { el, hass, calls };
}

describe('finding the last session in history', () => {
    let el;
    test.before(async () => {
        const Card = await loadCard();
        el = new Card();
        el.requestUpdate = () => {};
    });

    test('an empty history yields nothing', () => {
        assert.equal(el._lastSessionFromHistory([], 10), null);
    });

    test('a single run reports its peak and when it was reached', () => {
        const session = el._lastSessionFromHistory(
            [ws(0, 100), ws(30, 130), ws(120, 220), ws(0, 230)], 10);
        assert.deepEqual(session, { duration: 120, endedAt: 220_000 });
    });

    test('REST-shaped rows are read the same way', () => {
        const session = el._lastSessionFromHistory(
            [rest(0, 100), rest(120, 220), rest(0, 230)], 10);
        assert.deepEqual(session, { duration: 120, endedAt: 220_000 });
    });

    test('a button fumble after a real session does not hide it', () => {
        // 4 s is below the 10 s floor, so the 120 s run stays the answer.
        const session = el._lastSessionFromHistory(
            [ws(0, 100), ws(120, 220), ws(0, 230), ws(4, 300), ws(0, 310)], 10);
        assert.equal(session.duration, 120);
        assert.equal(session.endedAt, 220_000);
    });

    test('two sessions without an observed wipe are told apart by the drop', () => {
        // No zero row in between: the fall from 118 to 15 is what separates
        // them, and the newer one wins.
        const session = el._lastSessionFromHistory(
            [ws(30, 100), ws(118, 200), ws(15, 260), ws(95, 320)], 10);
        assert.deepEqual(session, { duration: 95, endedAt: 320_000 });
    });

    test('a run still in progress at the end of the window counts', () => {
        const session = el._lastSessionFromHistory([ws(0, 100), ws(60, 160)], 10);
        assert.deepEqual(session, { duration: 60, endedAt: 160_000 });
    });

    test('unreadable rows are skipped rather than breaking the scan', () => {
        const session = el._lastSessionFromHistory(
            [ws('unavailable', 100), ws(90, 180), ws('unknown', 190), ws(0, 200)], 10);
        assert.equal(session.duration, 90);
    });

    test('nothing long enough means no recap', () => {
        assert.equal(el._lastSessionFromHistory([ws(0, 100), ws(5, 110), ws(0, 120)], 10), null);
    });
});

describe('rebuilding the recap', () => {
    test('a completed run in history is adopted', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard();
        const endedAt = START.getTime() / 1000 - 300;
        hass.__response = {
            'sensor.io_time': [ws(0, endedAt - 130), ws(120, endedAt), ws(0, endedAt + 10)],
        };

        el.hass = hass;
        el.render();
        // The query is fired from render() without being awaited; give it a turn.
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(calls.length, 1, 'exactly one recorder query');
        assert.equal(calls[0].type, 'history/history_during_period');
        assert.equal(el._completed, true);
        assert.equal(el._completedIsFull, true, '120 s clears the 2-minute default');
        assert.equal(el._completedDuration, 120);
        assert.equal(el._completedAt, endedAt * 1000);
    });

    test('an aborted run is rebuilt but not called complete', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard();
        const endedAt = START.getTime() / 1000 - 300;
        hass.__response = {
            'sensor.io_time': [ws(0, endedAt - 60), ws(51, endedAt), ws(0, endedAt + 10)],
        };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(el._completed, true, 'the session is still shown');
        assert.equal(el._completedIsFull, false, 'but 51 s is not a finished routine');
    });

    test('the routine in force back then wins over the current reading', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // The handle now reports a 2-minute routine, but the session ran on a
        // 3-minute one - measured against today's value it would look complete.
        const { el, hass } = await idleCard({}, { routineLength: '120' });
        const endedAt = START.getTime() / 1000 - 300;
        hass.__response = {
            'sensor.io_time': [ws(0, endedAt - 130), ws(125, endedAt), ws(0, endedAt + 10)],
            'sensor.io_routine': [ws(180, endedAt - 600)],
        };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(el._completedDuration, 125);
        assert.equal(el._completedIsFull, false,
            '125 s of a 3-minute routine is an aborted run');
    });

    test('a device that reports a routine gets no recap when history cannot name one', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // routine_length exists but is unavailable now and unrecorded then, so
        // the short default must not be used to call a long run complete.
        const { el, hass } = await idleCard({}, { routineLength: 'unavailable' });
        const endedAt = START.getTime() / 1000 - 300;
        hass.__response = {
            'sensor.io_time': [ws(0, endedAt - 130), ws(125, endedAt), ws(0, endedAt + 10)],
            'sensor.io_routine': [],
        };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(el._completed, false, 'no target, no recap');
    });

    test('a failing recorder is survived quietly', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard();
        hass.callWS = async () => { throw new Error('recorder unavailable'); };

        el.hass = hass;
        assert.doesNotThrow(() => el.render());
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(el._completed, false);
    });

    test('a failing recorder is asked again after a cooldown', async (t) => {
        // A recorder that is merely still starting up must not cost the recap
        // for the page's lifetime — for oralb_live the query is the only way
        // back to one.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard();
        const endedAt = START.getTime() / 1000 - 300;
        let failing = true;
        hass.callWS = async (msg) => {
            calls.push(msg);
            if (failing) throw new Error('recorder starting');
            return { 'sensor.io_time':
                [ws(0, endedAt - 130), ws(120, endedAt), ws(0, endedAt + 10)] };
        };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(calls.length, 1, 'within the cooldown nothing is retried');

        failing = false;
        t.mock.timers.tick(31_000);
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(calls.length, 2, 'past the cooldown the query is retried');
        assert.equal(el._completed, true, 'and the recap is rebuilt');
    });

    test('an explicit routine_length in the config beats the recorded one', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // The option exists because the sensor's reading is not to be
        // trusted — so it must also decide the rebuilt session's target.
        const { el, hass } = await idleCard({ routine_length: 120 },
            { routineLength: '180' });
        const endedAt = START.getTime() / 1000 - 300;
        hass.__response = {
            'sensor.io_time': [ws(0, endedAt - 130), ws(120, endedAt), ws(0, endedAt + 10)],
            'sensor.io_routine': [ws(180, endedAt - 600)],
        };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(el._completedIsFull, true,
            'measured against the configured 120 s, not the recorded 180 s');
    });

    test('a sector-less device with an unreadable routine gets no recap either', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // Sonicare-shaped: routine entity, no sector entity. Its unreadable
        // routine must not fall back to the 2-minute default, which would
        // call an aborted 150 s Gum Health run complete.
        const { el, hass } = await idleCard({},
            { routineLength: 'unavailable', withSector: false });
        const endedAt = START.getTime() / 1000 - 300;
        hass.__response = {
            'sensor.io_time': [ws(0, endedAt - 160), ws(150, endedAt), ws(0, endedAt + 10)],
            'sensor.io_routine': [],
        };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(el._completed, false, 'no target, no recap');
    });

    test('a query that outlives a device switch changes nothing', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard();
        const endedAt = START.getTime() / 1000 - 300;
        let release;
        hass.callWS = () => new Promise((resolve) => {
            release = () => resolve({ 'sensor.io_time':
                [ws(0, endedAt - 130), ws(120, endedAt), ws(0, endedAt + 10)] });
        });

        el.hass = hass;
        el.render();
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev2' });
        release();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(el._completed, false,
            "device A's stale result must not appear as device B's session");
        assert.equal(el._historyRecapState, null,
            "nor may its 'done' block device B's own query");
    });

    test('the query runs once, not on every render', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard();
        hass.__response = { 'sensor.io_time': [] };

        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        el.render();
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(calls.length, 1);
    });

    test('history_recap: false switches the query off entirely', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard({ history_recap: false });
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(calls.length, 0);
    });

    test('the lookback follows hold_duration, and 0 means look far back', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard({ hold_duration: 0 });
        hass.__response = { 'sensor.io_time': [] };
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        const span = Date.parse(calls[0].end_time) - Date.parse(calls[0].start_time);
        assert.equal(span, 30 * 24 * 60 * MINUTE,
            'no hold limit means the recorder\'s own retention is the limit');
    });
});
