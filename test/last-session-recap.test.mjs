// Rebuilding the last session from the handle's own record.
//
// A card that was closed while somebody brushed has always had to work the
// session out afterwards, and until now the only way back was a recorder
// query - a reconstruction from a series of readings, blind to anything Home
// Assistant did not witness.
//
// Some integrations now read the record the handle keeps for itself. That is
// a better answer to the same question: it is what the device concluded, it
// arrives with the state rather than after a round trip, and it survives the
// case history cannot reach - a session brushed while Home Assistant was off
// leaves no rows at all, but the handle still remembers it.
//
// So the record is asked first, and history stays the fallback.

import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';
import { SMILEY_TIERS } from '../src/icons.js';

const START = new Date('2026-08-16T07:00:00Z');
// What the entity reports is when the session BEGAN - that is the moment the
// handle stamps on its record. The recap is about the ending, which is the
// start plus the duration the record carries beside it.
const STARTED = new Date('2026-08-16T06:53:13Z');
const RECORD_DURATION = 160;
const ENDED = new Date(STARTED.getTime() + RECORD_DURATION * 1000);

/**
 * An idle brush whose integration exposes a stored last session.
 *
 * `record` is what that entity reports; passing null leaves the entity out
 * entirely, which is every integration that has no such reading.
 */
async function idleCard({ record = {}, routineLength = null, config = {} } = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};

    const entities = {
        'sensor.b_state': {
            entity_id: 'sensor.b_state', device_id: 'dev1', platform: 'sonicare',
            translation_key: 'toothbrush_state',
        },
        'sensor.b_time': {
            entity_id: 'sensor.b_time', device_id: 'dev1', platform: 'sonicare',
            translation_key: 'time',
        },
        'sensor.b_sector': {
            entity_id: 'sensor.b_sector', device_id: 'dev1', platform: 'sonicare',
            translation_key: 'sector',
        },
    };
    const states = {
        'sensor.b_state': { state: 'idle', attributes: {}, last_changed: START.toISOString() },
        'sensor.b_time': {
            state: '0', attributes: { device_class: 'duration' },
            last_changed: START.toISOString(),
        },
        'sensor.b_sector': { state: 'no_sector', attributes: {}, last_changed: START.toISOString() },
    };
    if (record !== null) {
        entities['sensor.b_last'] = {
            entity_id: 'sensor.b_last', device_id: 'dev1', platform: 'sonicare',
            translation_key: 'last_session',
        };
        states['sensor.b_last'] = {
            state: record.state ?? STARTED.toISOString(),
            attributes: {
                duration_seconds: RECORD_DURATION,
                target_duration_seconds: 160,
                ...(record.attributes || {}),
            },
            last_changed: START.toISOString(),
        };
    }
    if (routineLength !== null) {
        entities['sensor.b_routine'] = {
            entity_id: 'sensor.b_routine', device_id: 'dev1', platform: 'sonicare',
            translation_key: 'routine_length',
        };
        states['sensor.b_routine'] = {
            state: routineLength, attributes: {}, last_changed: START.toISOString(),
        };
    }

    const calls = [];
    const hass = {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', name: 'Prestige', manufacturer: 'Philips', config_entries: ['ce1'] } },
        entities,
        states,
        callWS: async (msg) => { calls.push(msg); return hass.__response ?? {}; },
    };
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', ...config });
    return { el, hass, calls };
}

describe('the recap the handle remembers', () => {
    test('a stored session becomes the recap', async () => {
        const { el, hass } = await idleCard();
        const ids = { last_session: 'sensor.b_last' };
        assert.equal(el._recapFromLastSession(hass, {}, ids, 0), true);
        assert.equal(el._completed, true);
        assert.equal(el._completedDuration, 160);
        assert.equal(el._completedIsFull, true, 'ran its full routine');
        assert.equal(el._completedAt, ENDED.getTime());
    });

    test('a session short of its routine is not announced as complete', async () => {
        const { el, hass } = await idleCard({
            record: { attributes: { duration_seconds: 45 } },
        });
        assert.equal(el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0), true);
        assert.equal(el._completedDuration, 45);
        assert.equal(el._completedIsFull, false);
    });

    test('a blip too short to be a session is ignored', async () => {
        // Someone knocked the button. A recap for it would push a real
        // session off the card.
        const { el, hass } = await idleCard({
            record: { attributes: { duration_seconds: 3 } },
        });
        assert.equal(el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0), false);
        assert.ok(!el._completed, 'no recap was latched');
    });

    test('the duration reading stands in when the record carries none', async () => {
        // oralb_live reports the same two keys but keeps the duration in its
        // own entity, so both shapes have to work.
        const { el, hass } = await idleCard({
            record: { attributes: { duration_seconds: undefined } },
        });
        hass.states['sensor.b_dur'] = { state: '120', attributes: {} };
        const ids = { last_session: 'sensor.b_last', last_session_duration: 'sensor.b_dur' };
        assert.equal(el._recapFromLastSession(hass, {}, ids, 0), true);
        assert.equal(el._completedDuration, 120);
    });

    test('an unknown or missing reading yields nothing', async () => {
        for (const state of ['unknown', 'unavailable', 'not a time']) {
            const { el, hass } = await idleCard({ record: { state } });
            assert.equal(
                el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0),
                false, `state ${state} must not become a recap`);
        }
        const { el, hass } = await idleCard({ record: null });
        assert.equal(el._recapFromLastSession(hass, {}, {}, 0), false);
    });

    test('a configured routine length outranks the record', async () => {
        // The setting exists because the reported target is not to be
        // trusted; that has to hold here too.
        const { el, hass } = await idleCard();
        el._recapFromLastSession(hass, { routine_length: 300 },
            { last_session: 'sensor.b_last' }, 0);
        assert.equal(el._completedIsFull, false,
            '160 s against a 300 s target is not a complete routine');
    });

    test('the other word for the routine is understood too', async () => {
        // A Sonicare record calls it the routine length, an Oral-B one the
        // target duration. Same thing, and the card settled on the first
        // only because that handle came first - so it reads both.
        const { el, hass } = await idleCard({
            record: {
                attributes: {
                    target_duration_seconds: undefined,
                    target_duration_seconds: 300,
                },
            },
        });
        const ids = { last_session: 'sensor.b_last' };
        assert.equal(el._recapFromLastSession(hass, {}, ids, 0), true);
        assert.equal(el._completedIsFull, false,
            '160 s against a 5-minute target is not a complete routine');
        assert.equal(el._completedTarget, 300);
    });

    test('a device that reports a routine but cannot name one gets no recap', async () => {
        // Measuring against a default would announce an aborted long routine
        // as complete - the same refusal the history rebuild makes.
        const { el, hass } = await idleCard({
            record: { attributes: { target_duration_seconds: undefined } },
        });
        const ids = { last_session: 'sensor.b_last', routine_length: 'sensor.b_routine' };
        assert.equal(el._recapFromLastSession(hass, {}, ids, 0), false);
    });
});

describe('which source the card asks', () => {
    test('the handle answers first, without being waited for', async (t) => {
        // The point of the whole exercise: the badge is filled in from the
        // record as the card renders, with no query to wait on and no
        // dependence on Home Assistant having watched. The recorder is asked
        // as well - see the suite below for which of the two answers wins -
        // but nothing about the badge waits for it.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard();
        el.hass = hass;
        el.render();

        assert.equal(el._completed, true, 'filled in synchronously');
        assert.equal(el._completedDuration, 160);
        assert.equal(el._completedAt, ENDED.getTime());
        assert.equal(el._completedSource, 'device');
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(calls.length, 1, 'and the recorder was asked too');
    });

    test('without a record the recorder is still asked', async (t) => {
        // Every integration that exposes no such reading keeps the old
        // behaviour; this is an addition, not a replacement.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard({ record: null });
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(calls.length, 1, 'fell back to the recorder query');
        assert.equal(calls[0].type, 'history/history_during_period');
    });

    test('a record too short to use also falls back', async (t) => {
        // Declining is not the same as answering: a blip must not silence
        // the path that could still find the real session.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard({
            record: { attributes: { duration_seconds: 2 } },
        });
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(calls.length, 1, 'fell back to the recorder query');
    });
});

describe('a record that arrives in two stages', () => {
    // An integration that watches a session end can write down what it saw
    // straight away, and the handle's own record - with the session number
    // and how hard it was brushed - lands later, sometimes not until the
    // next time anything connects. Both arrive as the same reading, so the
    // second has to be able to replace the first.

    /** Put a record on the badge and hand back the card holding it. */
    async function withRecord(t, attributes) {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({ record: { attributes } });
        el.hass = hass;
        el.render();
        return { el, hass };
    }

    /** Replace the reading and render again. */
    function file(el, hass, attributes) {
        hass.states['sensor.b_last'] = {
            state: STARTED.toISOString(),
            attributes: { duration_seconds: RECORD_DURATION,
                          target_duration_seconds: 160, ...attributes },
            last_changed: START.toISOString(),
        };
        el.hass = hass;
        el.render();
    }

    test('the handle\'s own record replaces the counted one', async (t) => {
        const { el, hass } = await withRecord(t, { source: 'observed' });
        assert.equal(el._completedFromStore, false, 'counted, to begin with');

        file(el, hass, { source: 'retained_session', session_id: 349,
                         pressure_seconds: 8 });

        assert.equal(el._completedFromStore, true, 'and read, once it lands');
        assert.equal(el._completedPressure, 8, 'with what only it knows');
    });

    test('a record already read from the handle is left alone', async (t) => {
        // Nothing better can follow it, and the branch would otherwise go on
        // offering it for the life of the recap.
        const { el, hass } = await withRecord(t, { source: 'retained_session' });
        let renders = 0;
        const requestUpdate = el.requestUpdate;
        el.requestUpdate = () => { renders++; requestUpdate?.call(el); };
        el.render();
        assert.equal(renders, 0, 'no re-adoption, so no render asked for');
    });

    test('re-offering an unchanged counted record asks for no render', async (t) => {
        // It stays on offer until the handle files its own, which can be
        // hours - and a render requested from inside a render would spin.
        const { el, hass } = await withRecord(t, { source: 'observed' });
        let renders = 0;
        const requestUpdate = el.requestUpdate;
        el.requestUpdate = () => { renders++; requestUpdate?.call(el); };
        el.render();
        el.render();
        assert.equal(renders, 0);
        assert.equal(el._completedFromStore, false, 'and it is still counted');
    });
});

describe('which of the two answers wins', () => {
    // The record and the recorder answer the same question from opposite
    // ends, and neither is reliably the later one. A handle that files its
    // record late - some only write it as they switch off, and one waits for
    // the next time somebody connects - is still holding the session before
    // this one, and the recorder has the newer session all along. The other
    // way round, a session brushed while Home Assistant was out of range
    // left no rows at all, and only the handle remembers it.
    //
    // So both are asked and the later session wins, with a tie going to the
    // record: it describes the same session better than a series of readings
    // does.

    /** A history row in the WebSocket's compressed form. */
    const ws = (state, epochMs) => ({ s: String(state), lu: epochMs / 1000 });

    /**
     * A rise to `duration` peaking at `endedAt`, then the wipe back to zero -
     * the shape the rebuild looks for.
     */
    const mountain = (duration, endedAt) => [
        ws(0, endedAt - duration * 1000 - 1000),
        ws(Math.round(duration / 2), endedAt - duration * 500),
        ws(duration, endedAt),
        ws(0, endedAt + 1000),
    ];

    /**
     * Render, then let the query that render started come back.
     *
     * Deliberately no second render: the branch that lets a record take over
     * a session the card has already got would run again there and could
     * mask what the query itself decided. Tests that care about the settled
     * state render again themselves.
     */
    async function settle(el, hass) {
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
    }

    test('a session the recorder saw and the record has not caught up with', async (t) => {
        // The handle is still holding yesterday's session. Somebody brushed
        // this morning with the dashboard closed, and the recorder has it.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const yesterday = new Date(STARTED.getTime() - 24 * 3600_000);
        const { el, hass } = await idleCard({ record: { state: yesterday.toISOString() } });
        const thisMorning = START.getTime() - 10 * 60_000;
        hass.__response = { 'sensor.b_time': mountain(115, thisMorning) };

        await settle(el, hass);

        assert.equal(el._completedSource, 'history');
        assert.equal(el._completedAt, thisMorning);
        assert.equal(el._completedDuration, 115);
        // And it holds. The branch that lets a record take over a session
        // the card already has runs on every render afterwards, offering
        // yesterday's record against this morning's session - it has to lose
        // there too, or the rebuild's answer would be taken back one render
        // later and never asked for again.
        el.render();
        assert.equal(el._completedSource, 'history', 'the record did not take it back');
        assert.equal(el._completedAt, thisMorning);
    });

    test('a rebuild that only just wins is not taken back a render later', async (t) => {
        // The two bounds in play have to stay in step. A rebuild displaces a
        // record by being more than the record's clock error later; the
        // record is then offered again on the next render and turned away by
        // a bound of its own. Were that second bound the larger, a rebuild
        // that only just cleared the first would be handed straight back -
        // and never rebuilt again, the query having already run. So the
        // margin is measured from the constant rather than written out, and
        // this fails if the two are ever set the wrong way round.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard();
        const justLater = ENDED.getTime()
            + el.constructor.RECORD_CLOCK_SLACK_MS + 1000;
        hass.__response = { 'sensor.b_time': mountain(160, justLater) };

        await settle(el, hass);
        assert.equal(el._completedSource, 'history', 'the rebuild won');
        el.render();
        assert.equal(el._completedSource, 'history', 'and kept it');
        assert.equal(el._completedAt, justLater);
    });

    test('but the same session twice over stays with the record', async (t) => {
        // Both describe the session that ended a few minutes ago. The
        // recorder dates it from the reading and the handle from its own
        // counter, so the two disagree by a little - and a little must not
        // read as a later session, or the badge would lose the verdict and
        // the pressure the record carries and the rebuild knows nothing of.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({
            record: { attributes: { pressure_seconds: 12 } },
        });
        hass.__response = {
            'sensor.b_time': mountain(160, ENDED.getTime() + 30_000),
        };

        await settle(el, hass);

        assert.equal(el._completedSource, 'device', 'the query left it alone');
        assert.equal(el._completedAt, ENDED.getTime());
        assert.equal(el._completedPressure, 12, 'which the rebuild could not have supplied');
        el.render();
        assert.equal(el._completedSource, 'device', 'and it stays that way');
        assert.equal(el._completedPressure, 12);
    });

    test('a session brushed out of range leaves the record standing', async (t) => {
        // Nothing reached the recorder while it happened, so there is no
        // mountain to find. The handle is the only account of it there is.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard();
        hass.__response = { 'sensor.b_time': [] };

        await settle(el, hass);

        assert.equal(el._completedSource, 'device');
        assert.equal(el._completedAt, ENDED.getTime());
    });

    test('history_recap: false means the record is the only answer', async (t) => {
        // Turning the rebuild off still turns it off - including the part
        // that would have corrected the record.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const yesterday = new Date(STARTED.getTime() - 24 * 3600_000);
        const { el, hass, calls } = await idleCard({
            record: { state: yesterday.toISOString() },
            config: { history_recap: false },
        });
        hass.__response = { 'sensor.b_time': mountain(115, START.getTime() - 10 * 60_000) };

        await settle(el, hass);

        assert.equal(calls.length, 0, 'no query at all');
        assert.equal(el._completedSource, 'device');
    });

    test('a query that lands mid-session is dropped', async (t) => {
        // The rebuild is about a session that is over. If somebody has
        // started brushing by the time it answers, the card is showing that
        // instead and the answer is stale on arrival.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({ record: null });
        hass.__response = { 'sensor.b_time': mountain(115, START.getTime() - 10 * 60_000) };
        el.hass = hass;
        el.render();
        hass.states['sensor.b_state'] = {
            state: 'running', attributes: {}, last_changed: START.toISOString(),
        };
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.ok(!el._completed, 'the finished-session badge stayed away');
    });
});

describe('what the badge says when asked', () => {
    /** Render and return the finished-session paragraph. */
    async function badgeHtml(opts) {
        const { el, hass } = await idleCard(opts);
        el.hass = hass;
        const out = el.render();
        await new Promise(resolve => setImmediate(resolve));
        // A second render, now that the recap exists.
        const markup = JSON.stringify(el.render()) + JSON.stringify(out);
        return markup;
    }

    test('a record read from the handle says so', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const markup = await badgeHtml({
            record: { attributes: { source: 'retained_session' } },
        });
        assert.ok(markup.includes("Read from the brush's own record"));
    });

    test('one the integration counted itself says that instead', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // Both arrive as the same reading, and one of them is not a reading
        // of the handle at all: the integration watched the session end and
        // added it up. Crediting that to the brush's own record would claim
        // a source that was never consulted.
        const markup = await badgeHtml({
            record: { attributes: { source: 'observed' } },
        });
        assert.ok(markup.includes('Counted by Home Assistant'));
        assert.ok(!markup.includes("Read from the brush's own record"));
    });

    test('every source but that one word counts as counted', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // The other integration names the way its readings arrived rather
        // than saying "counted", and there is no listing those to keep up
        // with. Only `retained_session` means read.
        for (const source of ['advertisement', 'charger_bridge', 'direct_brush']) {
            const markup = await badgeHtml({ record: { attributes: { source } } });
            assert.ok(markup.includes('Counted by Home Assistant'), source);
        }
    });

    test('a record from before the field existed is credited to the handle', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // Those came from integrations that only ever read one.
        const markup = await badgeHtml({});
        assert.ok(markup.includes("Read from the brush's own record"));
    });

    test('the relative time carries the exact one', async (t) => {
        // "3 h ago" answers "recently or not". Anyone who needs to know
        // whether that was this morning or last night should not have to
        // work it out.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const markup = await badgeHtml({});
        // Which clock that is written on belongs to the profile, not to this
        // test - locale-format.test.mjs is where that rule is proved. An
        // English profile that has not been changed reads am/pm.
        const exact = new Date(ENDED).toLocaleString('en', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hourCycle: 'h12',
        });
        assert.ok(markup.includes(exact),
            `the exact time ${exact} should be on the badge as a tooltip`);
    });

    test('the badge says where it got the session from', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const fromDevice = await badgeHtml({});
        assert.ok(fromDevice.includes("Read from the brush's own record"),
            'a recap built from the stored record should say so');

        // Without a record the recorder answers instead, and the badge has
        // to admit that this one is a reconstruction.
        const { el, hass } = await idleCard({ record: null });
        hass.callWS = async () => ({
            'sensor.b_time': [
                { s: '0', lu: START.getTime() / 1000 - 400 },
                { s: '160', lu: START.getTime() / 1000 - 240 },
                { s: '0', lu: START.getTime() / 1000 - 230 },
            ],
        });
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(el._completedSource, 'history');
        assert.ok(JSON.stringify(el.render())
            .includes('Reconstructed from recorded history'));
    });

    test('a session the card watched end says so', async (t) => {
        // No stored record and nothing in history: the recap is the one the
        // card latched itself, and the badge must not credit the brush for
        // it.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({ record: null });
        hass.callWS = async () => ({});
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        // Now hand it a finished session the way the handle reports one.
        hass.states['sensor.b_time'] = {
            state: '160', attributes: { device_class: 'duration' },
            last_changed: new Date(START.getTime() - 60_000).toISOString(),
        };
        el.hass = hass;
        const markup = JSON.stringify(el.render());
        assert.equal(el._completed, true);
        assert.equal(el._completedSource, 'reading',
            'worked out from the reading, which is not the same as having '
            + 'seen the session end');
        assert.ok(markup.includes('Taken from the values left after'));
        assert.ok(!markup.includes('Watched this session end'),
            'that claim belongs to a session the card actually watched');
    });
});

describe('a record the handle has outrun', () => {
    test('is not shown as the recap', async () => {
        // The brush finished a session it has not written down yet, so this
        // record is the one before it. Showing it would tell somebody who
        // just brushed about their previous session.
        const { el, hass } = await idleCard({
            record: { attributes: { superseded: true } },
        });
        assert.equal(
            el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0),
            false);
        assert.ok(!el._completed);
    });

    test('leaves the recorder free to answer instead', async (t) => {
        // Declining must not silence the other route: history may well have
        // the session the handle is still sitting on.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard({
            record: { attributes: { superseded: true } },
        });
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(calls.length, 1, 'fell back to the recorder query');
    });
});

describe('not claiming more than is known', () => {
    test('a record with no trustworthy time is not shown', async () => {
        // The integration says "collection" when it could only establish
        // that the session was already over by the time it looked. The badge
        // would announce that as "just now" for something days old.
        const { el, hass } = await idleCard({
            record: { attributes: { time_source: 'collection' } },
        });
        assert.equal(
            el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0),
            false);
    });

    test('the times it can vouch for are shown', async () => {
        for (const source of ['session_end', 'handle_clock', undefined]) {
            const { el, hass } = await idleCard({
                record: { attributes: { time_source: source } },
            });
            assert.equal(
                el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0),
                true, `time_source ${source}`);
        }
    });

    test('an ancient record does not sit there as the current session', async (t) => {
        // With no hold window nothing expires a recap, and the record
        // outlives restarts - so without a bound a session from months ago
        // would render as the last one indefinitely.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({
            record: { state: new Date(START.getTime() - 60 * 24 * 3600_000).toISOString() },
        });
        const ids = { last_session: 'sensor.b_last' };
        assert.equal(el._recapFromLastSession(hass, { hold_duration: 0 }, ids, 0), false);
        // A hold window of its own already expires it, so the bound does not
        // apply there.
        assert.equal(el._recapFromLastSession(hass, { hold_duration: 4 }, ids, 0), true);
    });

    test('where a recap came from is forgotten with the recap', async () => {
        // Switching device in the editor drops the session state; the label
        // has to go with it, or the new device's recap is credited to the
        // old one's handle.
        const { el, hass } = await idleCard();
        el._recapFromLastSession(hass, {}, { last_session: 'sensor.b_last' }, 0);
        assert.equal(el._completedSource, 'device');
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev2' });
        assert.equal(el._completedSource, null);
    });
});

describe('a record that arrives after the card watched the session', () => {
    // The handle files its record a moment after the motor stops, so the
    // card usually latches the session first and the record lands second.
    // It describes the same session better than the latch does - it knows
    // the routine that was running and how hard it was brushed - so it
    // takes over.

    /** A card that has just watched a session end, its record still empty. */
    async function watched(t) {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({ record: { state: 'unknown' } });
        hass.callWS = async () => ({});
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        hass.states['sensor.b_time'] = {
            state: '160', attributes: { device_class: 'duration' },
            last_changed: new Date(START.getTime() - 60_000).toISOString(),
        };
        el.hass = hass;
        el.render();
        assert.equal(el._completed, true, 'the latch has the session');
        assert.equal(el._completedSource, 'reading',
            'from the reading the handle left standing, not from a record');
        return { el, hass };
    }

    /** Hand the card a filed record and let it render. */
    function file(el, hass, { at, ...attributes }) {
        hass.states['sensor.b_last'] = {
            state: at.toISOString(),
            attributes: { duration_seconds: 160, target_duration_seconds: 160, ...attributes },
            last_changed: at.toISOString(),
        };
        el.hass = hass;
        el.render();
    }

    test('the record of that session replaces what was latched', async (t) => {
        const { el, hass } = await watched(t);
        file(el, hass, {
            at: new Date(START.getTime() - 30_000),
            duration_seconds: 158, target_duration_seconds: 180, pressure_seconds: 12,
        });
        assert.equal(el._completedSource, 'device');
        assert.equal(el._completedDuration, 158, "the handle's own count of it");
        assert.equal(el._completedIsFull, false, 'measured against its 3-minute routine');
        assert.equal(el._completedPressure, 12);
    });

    test('a two-minute session is not mistaken for the one before it', async (t) => {
        // The record is stamped at the START of the session, so on a handle
        // that numbers nothing - every integration but one - the only thing
        // left to compare is time, and a long session's stamp sits a long
        // way before the moment the card watched it end. Read as an ending
        // it looks like the previous session and gets thrown away; the
        // longer somebody brushes, the more certainly it happens.
        const { el, hass } = await watched(t);
        file(el, hass, {
            at: new Date(START.getTime() - 160_000), duration_seconds: 160,
        });
        assert.equal(el._completedSource, 'device',
            'the record describes the session that just ended, not an older one');
        assert.equal(el._completedAt, START.getTime(),
            'and it is dated to when that session finished');
    });

    /** A card that watched a whole session, from start to finish. */
    async function watchedFromStart(t, { previousId = 341 } = {}) {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass } = await idleCard({
            record: {
                state: new Date(START.getTime() - 3600_000).toISOString(),
                attributes: {
                    duration_seconds: 150, target_duration_seconds: 160,
                    session_id: previousId,
                },
            },
        });
        hass.callWS = async () => ({});
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        // Brushing: this is where the mark is taken.
        hass.states['sensor.b_state'] = {
            state: 'running', attributes: {}, last_changed: START.toISOString(),
        };
        hass.states['sensor.b_time'] = {
            state: '30', attributes: { device_class: 'duration' },
            last_changed: START.toISOString(),
        };
        el.hass = hass;
        el.render();
        // And done.
        hass.states['sensor.b_state'] = {
            state: 'idle', attributes: {}, last_changed: START.toISOString(),
        };
        hass.states['sensor.b_time'] = {
            state: '160', attributes: { device_class: 'duration' },
            last_changed: START.toISOString(),
        };
        el.hass = hass;
        el.render();
        assert.equal(el._completed, true, 'the latch has the session');
        return { el, hass };
    }

    test('a session numbered later is this one, however the times read', async (t) => {
        // The record's time is reconstructed from the handle's own counter
        // and the latch's is taken whenever the card got round to rendering,
        // so the two drift for reasons that say nothing about which session
        // is which. Observed live: a perfectly good record dropped for being
        // dated a minute earlier, and the verdict appearing only after a
        // reload took the path without that comparison.
        const { el, hass } = await watchedFromStart(t);
        assert.equal(el._baselineSessionId, 341, 'the mark from the start');
        file(el, hass, {
            at: new Date(START.getTime() - 5 * 60_000),
            duration_seconds: 158, target_duration_seconds: 160, session_id: 342,
        });
        assert.equal(el._completedSource, 'device');
        assert.equal(el._completedDuration, 158);
    });

    test('the session already filed when this one started is not this one', async (t) => {
        // Same number as the mark: the handle has not filed the new session
        // yet, and this is the one it was holding all along - however
        // recently its timestamp reads.
        const { el, hass } = await watchedFromStart(t);
        file(el, hass, {
            at: new Date(START.getTime() - 1000),
            duration_seconds: 150, target_duration_seconds: 160, session_id: 341,
        });
        assert.notEqual(el._completedSource, 'device', 'not adopted');
        assert.equal(el._completedDuration, 160, 'still the session just watched');
    });

    test('a record that numbers nothing is judged by the times', async (t) => {
        // Not every integration numbers its sessions - Oral-B reports the
        // field as null. Read as a number that would be 0, and two such
        // records would compare equal and every session would look like the
        // one before it.
        const { el, hass } = await watchedFromStart(t, { previousId: null });
        assert.equal(el._baselineSessionId, null, 'nothing to mark with');
        file(el, hass, {
            at: new Date(START.getTime() - 30_000),
            duration_seconds: 158, target_duration_seconds: 160, session_id: null,
        });
        assert.equal(el._completedSource, 'device', 'adopted on its timing');
    });

    test('numbering that goes backwards falls back to the times', async (t) => {
        // Counting cannot go down, so a lower number means the mark belongs
        // to a different scheme than the record does - a handle that was
        // reset, or a device that numbers sessions some other way. Judging
        // by a mark that means nothing would hide every session from then
        // on, so the comparison is abandoned rather than trusted.
        const { el, hass } = await watchedFromStart(t);
        file(el, hass, {
            at: new Date(START.getTime() - 1000),
            duration_seconds: 158, target_duration_seconds: 160, session_id: 2,
        });
        assert.equal(el._completedSource, 'device', 'the times allow it');
        assert.equal(el._baselineSessionId, null, 'and the mark is discarded');
    });

    test('a record dated well before a frozen reading is still this session', async (t) => {
        // The case that sent a correct record to waste. After a reload the
        // recap comes from the reading the handle left standing, and what
        // looks like the session end is the last time that reading changed -
        // which, on a handle that had been away, is when it came back. A
        // record of the session itself is dated minutes earlier and read as
        // an older one.
        //
        // Measured on a Kids handle: session 22:26:02 to 22:28:02, the
        // handle back at 22:34:41, and its own record of that session
        // refused for being six minutes "too early".
        const { el, hass } = await watched(t);
        assert.equal(el._completedSource, 'reading', 'not watched, worked out');
        file(el, hass, {
            at: new Date(START.getTime() - 8 * 60_000),
            duration_seconds: 120, session_id: 390,
        });
        assert.equal(el._completedSource, 'device', 'the record was taken');
        assert.equal(el._completedDuration, 120);
    });

    test('the record of an earlier session does not', async (t) => {
        // A handle that files its record only when it powers off still holds
        // yesterday's until it does. That one is not this session.
        const { el, hass } = await watched(t);
        file(el, hass, {
            at: new Date(START.getTime() - 20 * 3600_000), duration_seconds: 90,
        });
        assert.notEqual(el._completedSource, 'device', 'not adopted');
        assert.equal(el._completedDuration, 160, 'still the session just watched');
    });
});

describe('the two ways a missed session is recovered', () => {
    // They answer one question - what was the last session - from two very
    // different places, and used to share a single setting. Turning the
    // reconstruction off took the handle's own record with it, which was
    // never what it meant.

    test('the record is read even with the history rebuild turned off', async () => {
        const { el, hass } = await idleCard({
            record: {
                attributes: { duration_seconds: 158, target_duration_seconds: 160 },
            },
            config: { history_recap: false },
        });
        let asked = false;
        hass.callWS = async () => { asked = true; return {}; };
        el.hass = hass;
        el.render();
        assert.equal(el._completedSource, 'device');
        assert.equal(asked, false, 'and the recorder is left alone');
    });

    test('the record can be turned off on its own', async () => {
        const { el, hass } = await idleCard({
            record: {
                attributes: { duration_seconds: 158, target_duration_seconds: 160 },
            },
            config: { device_recap: false },
        });
        hass.callWS = async () => ({});
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.notEqual(el._completedSource, 'device');
    });
});

describe('a verdict the card works out itself', () => {
    // A Sonicare shows no face and reports no score, so the badge's glyph
    // slot stayed empty on every handle but an Oral-B. The stored record
    // carries enough to judge the session by: how long it ran against the
    // routine it was running, and how much of that was brushed too hard.

    // Every case here reads a record dated shortly before START, so the clock
    // is held there for the whole block - otherwise the recap ages past its
    // hold window and the badge renders empty for reasons unrelated to the
    // verdict.
    beforeEach((t) => t.mock.timers.enable({ apis: ['Date'], now: START }));

    /** The tier the badge draws for a stored session, found by its icon. */
    async function verdict({ duration = 120, routine = 120, pressure, config = {} } = {}) {
        const attributes = { duration_seconds: duration, target_duration_seconds: routine };
        if (pressure !== undefined) attributes.pressure_seconds = pressure;
        const { el, hass } = await idleCard({ record: { attributes }, config });
        el.hass = hass;
        const text = markup(el.render());
        return {
            tier: Object.keys(SMILEY_TIERS)
                .find(name => text.includes(SMILEY_TIERS[name].path)) ?? null,
            text,
        };
    }

    test('a full session brushed gently reads best', async () => {
        assert.equal((await verdict({ pressure: 0 })).tier, 'excellent');
    });

    test('pressure lowers it', async () => {
        // The two ends are measured, not chosen: counted off the pressure
        // trace of two two-minute sessions on one handle, one pressed hard
        // through the opening segment (19.7 s) and one brushed deliberately
        // lightly (none at all). They have to land on different faces, and
        // the light one on the best.
        assert.equal((await verdict({ pressure: 19.7 })).tier, 'fair');
        assert.equal((await verdict({ pressure: 0 })).tier, 'excellent');
        // Between them, where an ordinary session sits.
        assert.equal((await verdict({ pressure: 6 })).tier, 'good');
    });

    test('a session cut short reads worse than a full one', async () => {
        assert.equal((await verdict({ duration: 40, pressure: 0 })).tier, 'poor');
        assert.equal((await verdict({ duration: 90, pressure: 0 })).tier, 'fair');
    });

    test('it is measured against the routine, not against two minutes', async () => {
        // 60 seconds is a whole session on a handle set to a 60 s routine and
        // a third of one on a three-minute routine.
        assert.equal((await verdict({ duration: 60, routine: 60, pressure: 0 })).tier,
            'excellent');
        assert.equal((await verdict({ duration: 60, routine: 180, pressure: 0 })).tier, 'poor');

    });

    test('a badge with no glyph centres its text', async () => {
        // The lines are ranged left so they line up beside a face. With no
        // face there is nothing to line up against, and the shorter second
        // line would hang off to one side of the first.
        const { text } = await verdict({ config: { show_verdict: false } });
        assert.match(text, /done-body[^"]*text-only/);
    });

    test('a badly judged session colours the whole badge', async () => {
        // Two colours side by side that disagree read as two statements. The
        // words say a session ended early, the face says how badly - and the
        // badge takes the harsher of them so they read as one.
        const { text } = await verdict({ duration: 40, pressure: 0 });
        assert.match(text, /done-badge[^"]*severe/);
    });

    test('a session that ran its course but was brushed hard is not green', async () => {
        // Nothing in the wording carries this one: the session was complete,
        // so it says "done". The colour is where the pressure shows.
        const { text } = await verdict({ duration: 120, routine: 120, pressure: 30 });
        assert.match(text, /done-badge[^"]*aborted/,
            'amber, the tone of the verdict, on a session the words call finished');
    });

    test('the badge says the verdict is the card\'s own', async () => {
        const { text } = await verdict({ pressure: 0 });
        assert.match(text, /Worked out from the session/,
            'a computed opinion must not read as something the handle reported');
    });

    test('without a pressure reading the best face is withheld', async () => {
        // How far the session got is a verdict on its own, and a handle that
        // cannot measure pressure at all - a kids brush has no sensor - would
        // otherwise never get one. But the top of the scale stays reserved:
        // "ran its course" and "ran its course and was brushed gently" are
        // different sessions, and only the reading tells them apart. So a
        // full session with nothing known about pressure reads one step
        // below the same session known to have been brushed lightly.
        assert.equal((await verdict({})).tier, 'good');
        assert.equal((await verdict({ pressure: 0 })).tier, 'excellent');
    });

    test('and the lower reaches are judged on time alone', async () => {
        // Nothing about pressure changes what a session cut short is worth.
        assert.equal((await verdict({ duration: 40 })).tier, 'poor');
        assert.equal((await verdict({ duration: 90 })).tier, 'fair');
        assert.equal((await verdict({ duration: 60, routine: 60 })).tier, 'good');
    });

    test('a session rebuilt from recorder rows gets none', async () => {
        // History says how long the handle ran and nothing else. A face
        // drawn from that alone would rate every session it reconstructs as
        // flawless, pressure unseen.
        const { el, hass } = await idleCard({ record: null });
        hass.callWS = async () => ({
            'sensor.b_time': [
                { s: '0', lu: START.getTime() / 1000 - 400 },
                { s: '160', lu: START.getTime() / 1000 - 240 },
                { s: '0', lu: START.getTime() / 1000 - 230 },
            ],
        });
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(el._completedSource, 'history');
        assert.ok(!Object.values(SMILEY_TIERS)
            .some(tier => markup(el.render()).includes(tier.path)));
    });

    test('switching the verdict off leaves the badge blank', async () => {
        assert.equal((await verdict({ pressure: 0, config: { show_verdict: false } })).tier,
            null);
    });
});

describe('the ring under a session that stopped early', () => {
    // The badge says "4 of 6 sextants finished" over a set of teeth with
    // nothing marked on it at all. Which zones were brushed is something the
    // card only knows while it is watching - reload the page and that is
    // gone - but the recap itself survives, in the record or in the reading,
    // and it carries how far the session got.
    //
    // So the ring is filled in from the recap the same way the badge text is.
    // Both numbers are worked out from one duration against one routine, and
    // the tests below assert that they agree rather than asserting each
    // against a literal: a count that drifts on one side only is the failure
    // being guarded against.

    beforeEach((t) => t.mock.timers.enable({ apis: ['Date'], now: START }));

    /** Render a stored session and read the badge and the teeth off it. */
    async function stoppedEarly({ duration, routine = 160, numSectors = 6 } = {}) {
        const { el, hass } = await idleCard({
            record: {
                attributes: { duration_seconds: duration, target_duration_seconds: routine },
            },
            // The routine is reported as a reading as well as sitting in the
            // record: the badge measures against the first, the record's own
            // target only reaches the verdict. Where the two differ the count
            // is the reading's - see the note in the suite below.
            routineLength: String(routine),
            config: { num_sectors: numSectors },
        });

        // classMap is a directive and carries no text into the template, so
        // what the teeth were told is taken where the card works it out -
        // the same wrapper the replay helpers use.
        let zones = null;
        const base = Object.getPrototypeOf(el)._getSectorData;
        el._getSectorData = function (...args) {
            zones = base.apply(this, args);
            return zones;
        };

        el.hass = hass;
        const text = markup(el.render());
        const badge = text.match(/(\d+) of (\d+) sextants finished/);
        return {
            el,
            done: Object.values(zones).filter(zone => zone.done).length,
            badge: badge ? Number(badge[1]) : null,
        };
    }

    test('marks the zones the badge counts', async () => {
        const { el, done, badge } = await stoppedEarly({ duration: 110 });
        assert.equal(el._completedIsFull, false, 'this is the stopped-early badge');
        assert.equal(badge, 4, '110 s of a 160 s routine is four sextants in');
        assert.equal(done, badge, 'and the teeth show what the badge counts');
    });

    test('and no more than that', async () => {
        // The zone being brushed when the session stopped is not a finished
        // one. Rounding it up would credit the session with a zone nobody
        // got to the end of.
        const { done, badge } = await stoppedEarly({ duration: 130 });
        assert.equal(badge, 4, '130 s is most of the way through the fifth');
        assert.equal(done, 4);
    });

    test('a session too short for one zone marks none', async () => {
        const { done, badge } = await stoppedEarly({ duration: 22 });
        assert.equal(badge, 0);
        assert.equal(done, 0, 'nothing was finished, so nothing is marked');
    });

    test('a full routine still marks every zone', async () => {
        // Guarding the other side of the branch: a complete session takes the
        // success path, which has nothing to do with the count.
        const { el, done } = await stoppedEarly({ duration: 160 });
        assert.equal(el._completedIsFull, true);
        assert.equal(done, 6);
    });

    test('quadrants are counted against four, not six', async () => {
        const { el, done } = await stoppedEarly({ duration: 110, numSectors: 4 });
        assert.equal(el._completedIsFull, false);
        assert.equal(done, 2, '110 s of a 160 s routine is two quadrants in');
    });
});
