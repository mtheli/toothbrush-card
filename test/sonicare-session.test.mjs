// What the card makes of real Philips Sonicare sessions.
//
// Both fixtures were captured with `sonicare_session_record.py` from the
// philips_sonicare_ble repo. Unlike the Oral-B captures these are not
// advertisement streams - a Sonicare handle is connection-oriented, so a
// recording is what its GATT characteristics reported over time.
//
// HX999X Prestige, full two-minute Clean routine. The end is what matters and
// it is why the card has a completion latch at all: the handle reports
// `session_complete` for a single sample, wipes its brushing timer to 0 in the
// same instant, and then switches itself off. Anything derived from the
// post-session state alone therefore sees nothing - only the observed
// active -> inactive transition carries the finished session over.
//
// HX6340 Kids, also a full routine, and different in three ways that matter:
// it is the only line divided into four sectors rather than six, the
// integration creates no brushing_state sensor for it at all, so the card has
// to work from handle_state alone, and the recording was started before the
// handle was switched on, so it carries the beginning of a session that the
// Prestige capture is missing.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import {
    loadSession, replaySession, stateAt, sectorState, currentSector,
    sectorsForModel,
} from './helpers/sonicare-integration.mjs';

const SESSION = loadSession(
    new URL('./fixtures/sonicare-hx999x-clean-complete.jsonl', import.meta.url));
const KIDS = loadSession(
    new URL('./fixtures/sonicare-hx6340-kids-complete.jsonl', import.meta.url));

describe('the recorded HX999X session', () => {
    test('is a complete two-minute Clean routine', () => {
        assert.equal(SESSION.meta.model, 'HX999X');
        const start = stateAt(SESSION, 2);
        assert.equal(start.routine_length, 120);
        assert.equal(start.brushing_mode, 'clean');
        assert.equal(start.handle_state, 'run');
        assert.equal(start.brushing_state, 'on');
    });

    test('ends by reporting completion and wiping the timer at once', () => {
        // The last sample before the end, and the end itself.
        const running = stateAt(SESSION, 90);
        assert.ok(running.brushing_time > 100,
            `expected a late timer reading, got ${running.brushing_time}`);

        const ended = stateAt(SESSION, 92.75);
        assert.equal(ended.brushing_time, 0, 'the timer is wiped');
        assert.equal(ended.brushing_state, 'off', 'and the state has already moved on');

        // `session_complete` really was reported - just not for long enough to
        // be readable as a lasting state.
        const completeSeen = SESSION.events.some(
            e => e.char === 'brushing_state' && e.hex === '03');
        assert.ok(completeSeen, 'session_complete appears in the recording');
    });

    test('leaves nothing behind to derive a recap from', () => {
        const after = stateAt(SESSION, 122.9);
        assert.equal(after.brushing_time, 0);
        assert.equal(after.handle_state, 'background');
    });
});

describe('sector derivation', () => {
    test('Clean sweeps the six sectors once', () => {
        const seen = [];
        for (let t = 1; t < 120; t += 1) {
            const s = currentSector('HX999X', 'clean', t, 120);
            if (seen.at(-1) !== s) seen.push(s);
        }
        assert.deepEqual(seen, [1, 2, 3, 4, 5, 6]);
    });

    test('White+ revisits the front-teeth sectors after the sweep', () => {
        const seen = [];
        for (let t = 1; t < 120; t += 1) {
            const s = currentSector('HX999X', 'white_plus', t, 120);
            if (seen.at(-1) !== s) seen.push(s);
        }
        assert.deepEqual(seen, [1, 2, 3, 4, 5, 6, 2, 5],
            'the revisit is what the card has a Sonicare-only branch for');
    });

    test('a finished routine reads as success', () => {
        const data = { brushing_state: 'on', handle_state_value: 2, brushing_time: 120, routine_length: 120 };
        assert.equal(sectorState(data, 'HX999X'), 'success');
    });
});

describe('the card replaying that session', () => {
    test('follows the sector through the recorded zones', async () => {
        const Card = await loadCard();
        const { rows } = await replaySession(Card, SESSION);

        const active = rows.filter(r => r.card && r.card.activeIndex >= 0);
        assert.ok(active.length > 0, 'the card highlighted a zone at some point');
        assert.equal(active[0].card.zoneCount, 6, 'a premium handle has six zones');

        const highlighted = [];
        for (const row of active) {
            if (highlighted.at(-1) !== row.card.activeIndex) {
                highlighted.push(row.card.activeIndex);
            }
        }
        // Zone 1 (index 0) is missing from the expectation on purpose: the
        // recording begins 28 s into the session, and at 20 s per zone the
        // handle had already moved on. That is a property of this capture, not
        // of the card - a recording started before the handle is switched on
        // would carry the first zone too.
        assert.equal(stateAt(SESSION, 0.8).brushing_time, 28,
            'the recording starts mid-session');
        assert.deepEqual(highlighted, [1, 2, 3, 4, 5],
            'each recorded zone is highlighted once, in order');
    });

    test('marks the finished session as complete', async () => {
        const Card = await loadCard();
        const { el, rows } = await replaySession(Card, SESSION);

        assert.equal(el._completed, true, 'the completion latch fired');
        assert.equal(el._completedIsFull, true, 'and it counts as a full routine');
        assert.ok(el._completedDuration >= 108,
            `the latched duration should be close to the routine, got ${el._completedDuration}`);

        // Every zone reads as done once the session is held as complete.
        const last = rows.at(-1);
        assert.equal(last.card.sector, 'success');
        assert.equal(last.card.done, 6);
    });

    test('does not fall back to the two-minute default', async () => {
        const Card = await loadCard();
        const { el } = await replaySession(Card, SESSION);
        assert.equal(el._sessionRoutineLength, 120,
            'the routine came from the handle, not from the default');
    });
});

describe('the recorded HX6340 Kids session', () => {
    test('is a four-sector handle, not a six-sector one', () => {
        assert.equal(KIDS.meta.model, 'HX6340');
        assert.equal(sectorsForModel(KIDS.meta.model), 4,
            'only the Kids line is divided into four');
    });

    test('reports no brushing_state at all', () => {
        // The integration does not create that sensor for a Kids handle
        // (sensor.py gates it on `if not is_kids`), so everything the card
        // knows about activity has to come from handle_state.
        assert.ok(!KIDS.events.some(e => e.char === 'brushing_state'));
        assert.equal(stateAt(KIDS, 60).brushing_state, null);
        assert.equal(stateAt(KIDS, 60).handle_state, 'run');
    });

    test('carries the start of the session, which the Prestige capture does not', () => {
        assert.equal(stateAt(KIDS, 1).handle_state, 'standby', 'recorded before switch-on');
        assert.equal(stateAt(KIDS, 4).handle_state, 'run');
        assert.equal(stateAt(KIDS, 124).handle_state, 'standby', 'and after switch-off');
    });

    test('ignores the mode, because Kids handles have no visit sequence', () => {
        // current_sector skips the mode table entirely for HX63xx and spreads
        // the routine evenly, so a Kids handle can never produce a revisit
        // no matter which mode is reported.
        for (const mode of ['clean', 'white_plus', 'gum_health']) {
            const seen = [];
            for (let t = 1; t < 120; t += 1) {
                const s = currentSector('HX6340', mode, t, 120);
                if (seen.at(-1) !== s) seen.push(s);
            }
            assert.deepEqual(seen, [1, 2, 3, 4], `for ${mode}`);
        }
    });

    test('briefly reads as success while the previous session is still on the clock', () => {
        // Real behaviour, worth knowing about: handle_state flips to run
        // before the handle resets its timer, so for the moment in between
        // the elapsed time is still the previous session's 120 s - which is
        // the routine length, hence "success".
        assert.equal(stateAt(KIDS, 3.5).brushing_time, 120);
        assert.equal(sectorState(stateAt(KIDS, 3.5), 'HX6340'), 'success');
        // It clears as soon as the handle reports a fresh timer.
        assert.ok(stateAt(KIDS, 20).brushing_time < 30);
        assert.equal(sectorState(stateAt(KIDS, 20), 'HX6340'), 'sector_1');
    });
});

describe('the card replaying the Kids session', () => {
    test('walks all four zones, first one included', async () => {
        const Card = await loadCard();
        const { rows } = await replaySession(Card, KIDS);

        const active = rows.filter(r => r.card && r.card.activeIndex >= 0);
        assert.equal(active[0].card.zoneCount, 4);

        const highlighted = [];
        for (const row of active) {
            if (highlighted.at(-1) !== row.card.activeIndex) {
                highlighted.push(row.card.activeIndex);
            }
        }
        assert.deepEqual(highlighted, [0, 1, 2, 3],
            'the whole sweep, including the zone the Prestige capture misses');
    });

    test('latches the finished session without a brushing_state to read', async () => {
        const Card = await loadCard();
        const { el } = await replaySession(Card, KIDS);
        assert.equal(el._completed, true);
        assert.equal(el._completedIsFull, true);
        assert.equal(el._sessionRoutineLength, 120);
    });
});
