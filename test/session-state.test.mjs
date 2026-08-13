// The completion latch, tested as what it now is: a function.
//
// session-latch.test.mjs stays where it is and keeps driving this through a
// whole card - that is what proves the card still wires it up correctly. This
// file goes at the transition directly, which reaches combinations that are
// awkward to stage through a rendering card: the two flags it hands back, and
// what the derive-from-current-state branch does with a device that reports no
// routine of its own.
//
// No fake clock here either. `now` is an argument, which was half the point of
// pulling this out.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    nextSessionState, initialSessionState,
    BRUSHING_DURATION, MIN_RECAP_SECONDS,
} from '../src/session-state.js';

const NOW = Date.parse('2026-08-11T18:00:00Z');

/** Defaults for the reading, so each test states only what it is about. */
const reading = (over = {}) => ({
    active: false,
    duration: 0,
    routineLength: 120,
    now: NOW,
    holdCompleted: true,
    hasRoutineEntity: true,
    hasDurationEntity: true,
    historyRecapEnabled: true,
    durationLastChanged: null,
    ...over,
});

/** Run a list of readings from the initial state. */
function run(readings, start = initialSessionState()) {
    let state = start;
    let last = null;
    for (const over of readings) {
        last = nextSessionState(state, reading(over));
        state = last.state;
    }
    return { ...last, state };
}

describe('the shape of the thing', () => {
    test('a fresh state has nothing to show, and goes looking', () => {
        // An idle device with no session held is precisely the case the
        // recorder rebuild exists for, so the flag comes up on the very first
        // reading rather than after some settling period.
        const { state, sessionStarted, loadHistoryRecap } = run([{ active: false, duration: 0 }]);
        assert.equal(state.completed, false);
        assert.equal(sessionStarted, false);
        assert.equal(loadHistoryRecap, true);
    });

    test('the previous state is never mutated', () => {
        const before = initialSessionState();
        const snapshot = JSON.stringify(before);
        nextSessionState(before, reading({ active: true, duration: 30 }));
        assert.equal(JSON.stringify(before), snapshot);
    });
});

describe('the session-started flag', () => {
    test('is raised once, on the transition into a session', () => {
        const first = nextSessionState(initialSessionState(), reading({ active: true, duration: 1 }));
        assert.equal(first.sessionStarted, true);
        const second = nextSessionState(first.state, reading({ active: true, duration: 2 }));
        assert.equal(second.sessionStarted, false, 'not on every reading of a running handle');
    });

    test('is what tells the card to forget a dismissal', () => {
        const dismissed = { ...initialSessionState(), holdDismissed: true };
        const { state, sessionStarted } = run([{ active: true, duration: 1 }], dismissed);
        assert.equal(sessionStarted, true);
        assert.equal(state.holdDismissed, false, 'cleared in the state as well');
    });

    test('is raised again for the next session', () => {
        const { state } = run([
            { active: true, duration: 60 },
            { active: false, duration: 0 },
        ]);
        assert.equal(nextSessionState(state, reading({ active: true, duration: 1 })).sessionStarted,
            true);
    });
});

describe('the recorder flag', () => {
    const idle = { active: false, duration: 0 };

    test('is raised for an idle device with nothing to show', () => {
        assert.equal(run([idle]).loadHistoryRecap, true);
    });

    test('but never while something is already held', () => {
        const held = { ...initialSessionState(), completed: true, completedDuration: 120 };
        assert.equal(run([idle], held).loadHistoryRecap, false);
    });

    test('nor while a dismissal stands', () => {
        const dismissed = { ...initialSessionState(), holdDismissed: true };
        assert.equal(run([idle], dismissed).loadHistoryRecap, false);
    });

    test('nor when it is switched off, or there is nothing to query', () => {
        assert.equal(run([{ ...idle, historyRecapEnabled: false }]).loadHistoryRecap, false);
        assert.equal(run([{ ...idle, hasDurationEntity: false }]).loadHistoryRecap, false);
        assert.equal(run([{ ...idle, holdCompleted: false }]).loadHistoryRecap, false);
    });

    test('and never at the same time as deriving a recap from the state', () => {
        // The two are alternatives: a reading that already describes a session
        // is used directly rather than looked up.
        const { state, loadHistoryRecap } = run([{ active: false, duration: 115 }]);
        assert.equal(state.completed, true);
        assert.equal(loadHistoryRecap, false);
    });
});

describe('deriving a recap from a frozen reading', () => {
    test('adopts the timestamp the duration entity carries', () => {
        const changed = '2026-08-11T17:45:00Z';
        const { state } = run([{ active: false, duration: 115, durationLastChanged: changed }]);
        assert.equal(state.completedAt, Date.parse(changed),
            'when the session actually ended, not when the card noticed');
    });

    test('falls back to now when there is no usable timestamp', () => {
        const { state } = run([{ active: false, duration: 115, durationLastChanged: 'nonsense' }]);
        assert.equal(state.completedAt, NOW);
    });

    test('a device that reports a routine is not measured against the default', () => {
        // routineLength 0 means the sensor is unreadable right now. Measuring
        // an aborted three-minute routine against the two-minute default would
        // announce it as finished.
        const { state } = run([{
            active: false, duration: 115, routineLength: 0, hasRoutineEntity: true,
        }]);
        assert.equal(state.completed, false, 'no target, no recap');
    });

    test('a device without one falls back to the default', () => {
        const { state } = run([{
            active: false, duration: 115, routineLength: 0, hasRoutineEntity: false,
        }]);
        assert.equal(state.completed, true);
        assert.equal(state.completedIsFull, true,
            `115 s clears 90% of the ${BRUSHING_DURATION} s default`);
    });

    test('a later, different reading is adopted - downwards too', () => {
        const first = run([{ active: false, duration: 115 }]);
        assert.equal(first.state.completedDuration, 115);
        const second = nextSessionState(first.state,
            reading({ active: false, duration: 40, durationLastChanged: null }));
        assert.equal(second.state.completedDuration, 40,
            'a shorter reading is a newer session, not a glitch to ignore');
    });

    test('the same reading again changes nothing', () => {
        const first = run([{ active: false, duration: 115, durationLastChanged: '2026-08-11T17:45:00Z' }]);
        const at = first.state.completedAt;
        const second = nextSessionState(first.state, reading({ active: false, duration: 115, now: NOW + 60_000 }));
        assert.equal(second.state.completedAt, at, 'the timestamp is not restamped');
    });

    test('a reading below the floor is not a session', () => {
        const { state } = run([{ active: false, duration: MIN_RECAP_SECONDS - 1 }]);
        assert.equal(state.completed, false);
    });
});

describe('the routine a session is measured against', () => {
    test('is the one in force while it ran, not the one reported after', () => {
        const { state } = run([
            { active: true, duration: 60, routineLength: 180 },
            { active: true, duration: 140, routineLength: 180 },
            // The sensor drops out as the handle disconnects.
            { active: false, duration: 0, routineLength: 0 },
        ]);
        assert.equal(state.completedDuration, 140);
        assert.equal(state.completedIsFull, false,
            '140 s misses 90% of the 3-minute routine; against the 2-minute '
            + 'default it would have counted as finished');
    });

    test('and the default stands in when a session never reported one', () => {
        const { state } = run([
            { active: true, duration: 115, routineLength: 0, hasRoutineEntity: false },
            { active: false, duration: 0, routineLength: 0, hasRoutineEntity: false },
        ]);
        assert.equal(state.completedIsFull, true);
    });
});

// The Oral-B display face (issue #20). The awkward part is that the handle
// shows its verdict in a summary state, which is NOT active - so the value
// arrives after the transition the recap is latched on, and the window has to
// stay open past it.
describe('the display face', () => {
    test('a handle that reports none leaves the badge alone', () => {
        const { state } = run([
            { active: true, duration: 130 },
            { active: false, duration: 130 },
        ]);
        assert.equal(state.completedFace, null);
    });

    test('`off` is the display asleep, not a verdict', () => {
        const { state } = run([
            { active: true, duration: 130, displayFace: 'off', faceWindow: true },
            { active: false, duration: 130, displayFace: 'off', faceWindow: true },
        ]);
        assert.equal(state.completedFace, null);
    });

    test('a face arriving only after the session ended still lands', () => {
        // The motor stops, the recap latches, and the summary state follows a
        // reading later carrying the actual result.
        const { state } = run([
            { active: true, duration: 130, faceWindow: true },
            { active: false, duration: 130, faceWindow: true },
            { active: false, duration: 130, displayFace: 'special_11', faceWindow: true },
        ]);
        assert.equal(state.completed, true);
        assert.equal(state.completedFace, 'special_11');
    });

    test('the window closes: a face outside it is ignored', () => {
        // Whatever the display shows hours later, sitting in the charger, must
        // not overwrite the face the finished session earned.
        const { state } = run([
            { active: true, duration: 130, faceWindow: true },
            { active: false, duration: 130, displayFace: 'special_10', faceWindow: true },
            { active: false, duration: 130, displayFace: 'special_3', faceWindow: false },
        ]);
        assert.equal(state.completedFace, 'special_10');
    });

    test('a new session drops the old face before earning its own', () => {
        const { state } = run([
            { active: true, duration: 130, faceWindow: true },
            { active: false, duration: 130, displayFace: 'special_11', faceWindow: true },
            { active: true, duration: 5, faceWindow: true },
        ]);
        assert.equal(state.completedFace, null,
            'the previous face must not hang over a session in progress');
    });

    test('a fumble restores the stashed face along with the recap', () => {
        // Below MIN_RECAP_SECONDS the run is a button press, not a session, so
        // the previous recap comes back - face included.
        const { state } = run([
            { active: true, duration: 130, faceWindow: true },
            { active: false, duration: 130, displayFace: 'special_11', faceWindow: true },
            { active: true, duration: MIN_RECAP_SECONDS - 5, faceWindow: true },
            { active: false, duration: 0, faceWindow: false },
        ]);
        assert.equal(state.completed, true);
        assert.equal(state.completedFace, 'special_11');
    });
});

describe('the score a handle reports at the end', () => {
    test('is kept for as long as the recap is held', () => {
        const { state } = run([
            { active: true, duration: 60 },
            { active: false, duration: 0, displayScore: '92' },
        ]);
        assert.equal(state.completed, true);
        assert.equal(state.completedScore, '92');
    });

    test('is adopted even when it lands a render late', () => {
        // Xiaomi puts the score in the switch-off advertisement, so it arrives
        // with the transition at best - and a beat after it at worst.
        const first = run([
            { active: true, duration: 60 },
            { active: false, duration: 0 },
        ]);
        assert.equal(first.state.completedScore, null, 'nothing yet');
        const later = nextSessionState(first.state,
            reading({ active: false, duration: 0, displayScore: '78' }));
        assert.equal(later.state.completedScore, '78');
    });

    test('is not carried into the next session', () => {
        // Starting a session clears the recap, and the score goes with it -
        // otherwise a handle that reports none would show the previous one.
        const held = run([
            { active: true, duration: 60 },
            { active: false, duration: 0, displayScore: '92' },
        ]);
        const started = nextSessionState(held.state,
            reading({ active: true, duration: 3, displayScore: '92' }));
        assert.equal(started.state.completedScore, null);
    });

    test('is absent for a handle that reports none', () => {
        const { state } = run([
            { active: true, duration: 60 },
            { active: false, duration: 0 },
        ]);
        assert.equal(state.completedScore, null);
    });
});
