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

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';

const START = new Date('2026-08-16T07:00:00Z');
const ENDED = new Date('2026-08-16T06:53:13Z');

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
            state: record.state ?? ENDED.toISOString(),
            attributes: {
                duration_seconds: 160,
                routine_length_seconds: 160,
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
        callWS: async (msg) => { calls.push(msg); return {}; },
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

    test('a device that reports a routine but cannot name one gets no recap', async () => {
        // Measuring against a default would announce an aborted long routine
        // as complete - the same refusal the history rebuild makes.
        const { el, hass } = await idleCard({
            record: { attributes: { routine_length_seconds: undefined } },
        });
        const ids = { last_session: 'sensor.b_last', routine_length: 'sensor.b_routine' };
        assert.equal(el._recapFromLastSession(hass, {}, ids, 0), false);
    });
});

describe('which source the card asks', () => {
    test('the handle is asked instead of the recorder', async (t) => {
        // The point of the whole exercise: no query, no waiting, and an
        // answer that does not depend on Home Assistant having watched.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, hass, calls } = await idleCard();
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));

        assert.equal(calls.length, 0, 'the recorder was not queried');
        assert.equal(el._completed, true);
        assert.equal(el._completedDuration, 160);
        assert.equal(el._completedAt, ENDED.getTime());
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

    test('the relative time carries the exact one', async (t) => {
        // "3 h ago" answers "recently or not". Anyone who needs to know
        // whether that was this morning or last night should not have to
        // work it out.
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const markup = await badgeHtml({});
        const exact = new Date(ENDED).toLocaleString('en', {
            dateStyle: 'medium', timeStyle: 'short',
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
        assert.ok(!el._completedSource, 'nothing reconstructed it');
        assert.ok(markup.includes('Watched this session end'));
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
