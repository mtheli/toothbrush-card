// A characterisation of the completed-session latch.
//
// The latch is the most intricate thing in the card - issues #4, #5, #11 and
// #18 all landed here - and it is spread across nine mutable fields that
// render() updates as a side effect. It is also integration-agnostic: by the
// time it runs, `active` and `duration` have already been normalised, so
// whether they came from an Oral-B advertisement or a Laifen timer makes no
// difference to it.
//
// The per-integration tests reach it incidentally, through whichever fixture
// they happen to drive. This file drives it deliberately, as a sequence of
// states fed in one at a time, and records what falls out.
//
// It is a characterisation test, not a specification: it pins what the card
// does today so that pulling this state machine out of render() cannot change
// it unnoticed. Where today's behaviour looks questionable it is written down
// as-is and said so, rather than quietly corrected.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { laifenHass } from './helpers/laifen-integration.mjs';

const START = new Date('2026-08-11T06:00:00Z');
const MINUTE = 60_000;

/**
 * Feed a sequence of session samples through the card.
 *
 * Each step is `{ running, timer, tick }`: whether the handle reports itself
 * as running, its elapsed seconds, and how far to advance the clock first.
 * Returns the latch state afterwards.
 */
async function drive(steps, { routineMinutes = 2, config = {} } = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1',
        history_recap: false, ...config,
    });

    for (const step of steps) {
        if (step.tick) await Promise.resolve();
        el.hass = laifenHass({
            model: 'wave', routineMinutes,
            status: step.running ? 'Running' : 'Idle',
            timer: step.timer ?? 0,
        });
        el.render();
    }
    return {
        completed: el._completed,
        isFull: el._completedIsFull,
        duration: el._completedDuration,
        at: el._completedAt,
        peak: el._peakDuration,
        stashed: el._stashedRecap,
        routine: el._sessionRoutineLength,
    };
}

/** A run of `seconds`, sampled every 10 s, then switched off. */
const session = (seconds) => [
    ...Array.from({ length: Math.floor(seconds / 10) + 1 },
        (_, i) => ({ running: true, timer: Math.min(seconds, i * 10) })),
    { running: false, timer: 0 },
];

describe('a session that runs to the end', () => {
    test('is latched as completed and full', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive(session(120));
        assert.equal(state.completed, true);
        assert.equal(state.isFull, true);
        assert.equal(state.duration, 120, 'the peak, not the wiped final reading');
        assert.equal(state.at, START.getTime(), 'stamped when the session ended');
    });

    test('counts as full slightly short of the target', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        // The 0.9 tolerance covers a handle powering off a beat before the
        // last sample lands exactly on the routine length.
        const state = await drive(session(110));
        assert.equal(state.isFull, true, '110 of 120 s clears the tolerance');
    });

    test('but not well short of it', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive(session(100));
        assert.equal(state.completed, true, 'an aborted run still gets a recap');
        assert.equal(state.isFull, false, 'just not a finished one');
    });
});

describe('runs too short to mean anything', () => {
    test('a few seconds of fumbling leaves no recap', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive([
            { running: true, timer: 3 },
            { running: false, timer: 0 },
        ]);
        assert.equal(state.completed, false);
    });

    test('and does not replace the recap already on screen', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const Card = await loadCard();
        const el = new Card();
        el.requestUpdate = () => {};
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false });

        const feed = (running, timer) => {
            el.hass = laifenHass({ model: 'wave', routineMinutes: 2, status: running ? 'Running' : 'Idle', timer });
            el.render();
        };

        for (const s of session(120)) feed(s.running, s.timer);
        const real = { duration: el._completedDuration, at: el._completedAt };
        assert.equal(real.duration, 120);

        // A four-second bump of the button, minutes later.
        t.mock.timers.tick(5 * MINUTE);
        feed(true, 4);
        feed(false, 0);

        assert.equal(el._completed, true, 'the earlier session is back');
        assert.equal(el._completedDuration, real.duration);
        assert.equal(el._completedAt, real.at, 'including its original timestamp');
    });

    test('a real session does replace the previous one', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const Card = await loadCard();
        const el = new Card();
        el.requestUpdate = () => {};
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false });
        const feed = (running, timer) => {
            el.hass = laifenHass({ model: 'wave', routineMinutes: 2, status: running ? 'Running' : 'Idle', timer });
            el.render();
        };

        for (const s of session(120)) feed(s.running, s.timer);
        t.mock.timers.tick(5 * MINUTE);
        for (const s of session(60)) feed(s.running, s.timer);

        assert.equal(el._completedDuration, 60, 'the newer, shorter session wins');
        assert.equal(el._completedIsFull, false);
    });
});

describe('what a running session does to the latch', () => {
    test('starting one clears the previous result immediately', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive([
            ...session(120),
            { running: true, timer: 5 },
        ]);
        assert.equal(state.completed, false, 'the recap goes as soon as brushing resumes');
        assert.ok(state.stashed, 'but it is kept aside in case this is another fumble');
        assert.equal(state.stashed.duration, 120);
    });

    test('the routine governing the session is snapshotted while it runs', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive(session(120), { routineMinutes: 3 });
        assert.equal(state.routine, 180,
            'so the end of the session is measured against the right target');
    });

    test('the peak survives a reading that drops back', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive([
            { running: true, timer: 30 },
            { running: true, timer: 115 },
            { running: true, timer: 0 },
            { running: false, timer: 0 },
        ]);
        assert.equal(state.duration, 115, 'the highest reading seen, not the last');
    });
});

describe('configuration', () => {
    test('hold_completed: false suppresses the latch entirely', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive(session(120), { config: { hold_completed: false } });
        assert.equal(state.completed, false);
    });

    test('a configured routine_length overrides the device', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const state = await drive(session(120), {
            routineMinutes: 2, config: { routine_length: 240 },
        });
        assert.equal(state.routine, 240);
        assert.equal(state.isFull, false, '120 s of a 4-minute routine is not a finished one');
    });
});

describe('the handle pacer, which changes how many zones there are', () => {
    // Laifen-only, and the one behavioural branch of that integration with no
    // coverage until now: with the handle's own 30-second reminder switched on
    // it buzzes every 30 s, so a 3-minute routine is six zones rather than the
    // default four - and card and handle change zone together.
    async function zones({ pacer, routineMinutes, config = {} }) {
        const Card = await loadCard();
        const el = new Card();
        el.requestUpdate = () => {};
        el.setConfig({
            type: 'custom:toothbrush-card', device_id: 'dev1',
            history_recap: false, ...config,
        });
        let count = null;
        const base = Object.getPrototypeOf(el)._getSectorData;
        el._getSectorData = function (sector, activeIndex, order, doneCount = null) {
            count = order.length;
            return base.call(this, sector, activeIndex, order, doneCount);
        };
        el.hass = laifenHass({ model: 'wave', routineMinutes, pacer, status: 'Running', timer: 45 });
        el.render();
        return count;
    }

    test('off is four zones', async () => {
        assert.equal(await zones({ pacer: false, routineMinutes: 3 }), 4);
    });

    test('on with a three-minute routine is six', async () => {
        assert.equal(await zones({ pacer: true, routineMinutes: 3 }), 6,
            'six buzzes of 30 s each');
    });

    test('on with a two-minute routine stays at four', async () => {
        // Four zones of 30 s is the default anyway, so nothing changes.
        assert.equal(await zones({ pacer: true, routineMinutes: 2 }), 4);
    });

    test('an explicit sector count always wins', async () => {
        assert.equal(
            await zones({ pacer: true, routineMinutes: 3, config: { num_sectors: 4 } }), 4);
    });
});
