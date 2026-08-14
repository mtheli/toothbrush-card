// A Prestige recording that holds two sessions: a complete White+ routine and,
// one second later, a second run stopped after 22 of 160 seconds.
//
// Everything else in the suite ends well. The three earlier Sonicare
// recordings only ever report brushing_state 0, 1 and 3 (off / on /
// session_complete), so the states a stopped session goes through - 2 (pause)
// and 4 (session_aborted) - had no capture behind them at all, and the card's
// "stopped early" path was only ever exercised against hand-built states.
//
// It also matters that the two sessions sit in one recording. The second one
// starts before the first has left the card's completion hold, so the recap
// has to be replaced rather than merely set: a full routine first, a fifth of
// one second. That sequence is not something a single-session fixture can
// produce.
//
// The handle switched itself off at the end, which is why the recording stops
// where it does - see the "ended" field in its meta line.

import test, { describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { loadSession, stateAt, replaySession } from './helpers/sonicare-integration.mjs';

const SESSION = loadSession(
    new URL('./fixtures/sonicare-hx999x-whiteplus-then-aborted.jsonl', import.meta.url));

// The brushing_state readings as they arrived. Deliberately not folded into a
// snapshot: the two readings this fixture is here for are each overwritten in
// the same tenth of a second they appear in, so a snapshot never shows them.
const brushingStates = SESSION.events
    .filter(event => event.char === 'brushing_state')
    .map(event => ({ t: event.t, value: parseInt(event.hex, 16) }));

/** Where a one-sample reading sits, and what replaced it. */
const singleSample = (value) => {
    const at = brushingStates.findIndex(state => state.value === value);
    assert.ok(at >= 0, `brushing_state ${value} never appears`);
    return { sample: brushingStates[at], next: brushingStates[at + 1] };
};

describe('what the recording contains', () => {
    test('two sessions, the second stopped early', () => {
        // The complete one runs the full routine; the second is abandoned.
        assert.equal(stateAt(SESSION, 188).brushing_time, 159);
        assert.equal(stateAt(SESSION, 188).routine_length, 160);
        assert.equal(stateAt(SESSION, 213).brushing_time, 22);
    });

    test('it reaches pause and session_aborted, which nothing else does', () => {
        const values = brushingStates.map(state => state.value);
        assert.ok(values.includes(2), `no pause in ${values}`);
        assert.ok(values.includes(4), `no session_aborted in ${values}`);
        // Pause is the one that does linger: the handle sat paused for 30 s
        // before giving up, so a snapshot can see it.
        assert.equal(stateAt(SESSION, 220).brushing_state, 'pause');
    });

    test('the completion sample is a single reading, as always', () => {
        // The handle reports session_complete and wipes the timer in the same
        // instant. This is the third capture to show it, and the reason the
        // card latches instead of reading.
        const { sample, next } = singleSample(3);
        assert.equal(next.value, 0, 'session_complete is replaced by off');
        assert.ok(next.t - sample.t < 0.5,
            `and within ${(next.t - sample.t).toFixed(2)}s of appearing`);
        assert.equal(stateAt(SESSION, sample.t).brushing_state, 'off',
            'so even a snapshot taken at that instant misses it');
        assert.equal(stateAt(SESSION, sample.t).brushing_time, 0,
            'the timer is wiped in the same moment');
    });

    test('the abort is reported exactly the same way', () => {
        // Which is the point: a stopped session is no more readable after the
        // fact than a finished one. Both need the latch.
        const { sample, next } = singleSample(4);
        assert.equal(next.value, 0);
        assert.ok(next.t - sample.t < 0.5);
        assert.equal(stateAt(SESSION, sample.t).brushing_state, 'off');
    });

    test('the mode is White+, from the routine-id characteristic', () => {
        assert.equal(stateAt(SESSION, 10).brushing_mode, 'white_plus');
        assert.equal(stateAt(SESSION, 10).routine_length, 160,
            'White+ is 160 s, not the 120 s the card would otherwise assume');
    });

    test('the intensity changes mid-session, twice', () => {
        // Worth pinning: a reading that moves during a session, which the
        // Clean and Kids captures never show.
        assert.equal(stateAt(SESSION, 60).intensity, 'high');
        assert.equal(stateAt(SESSION, 82).intensity, 'medium');
        assert.equal(stateAt(SESSION, 100).intensity, 'low');
    });
});

describe('the card replaying both sessions', () => {
    let el;

    before(async () => {
        const Card = await loadCard();
        ({ el } = await replaySession(Card, SESSION));
    });

    test('ends up holding the second, incomplete session', () => {
        assert.equal(el._completed, true, 'a session is still being held');
        assert.equal(el._completedIsFull, false,
            '22 s of a 160 s routine is not a full routine');
    });

    test('and the recap describes that one, not the complete one before it', () => {
        // The failure this guards is the recap staying on the good session:
        // the first run was complete and would look better on the badge, but
        // it is not the one that just happened.
        //
        // Two independent paths produce this, which mutation testing turned up
        // rather than reading did: the peak-duration latch reset between
        // sessions, and the issue #11 adoption of a frozen reading downwards
        // (the handle keeps reporting 22 s for another 30 s after stopping).
        // Disabling either one alone changes nothing here - only removing both
        // fails this assertion. So it is a check on the outcome, not a probe of
        // one mechanism, and it will not notice if one of the two is lost.
        assert.ok(el._completedDuration < 60,
            `expected the short session's duration, got ${el._completedDuration}`);
    });

    test('the routine length comes from the handle, not the default', () => {
        assert.equal(el._sessionRoutineLength, 160);
    });
});
