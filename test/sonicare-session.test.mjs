// What the card makes of real Philips Sonicare sessions.
//
// Both fixtures were captured with `sonicare_session_record.py` from the
// philips_sonicare_ble repo. Unlike the Oral-B captures these are not
// advertisement streams - a Sonicare handle is connection-oriented, so a
// recording is what its GATT characteristics reported over time.
//
// HX999X Prestige, full two-minute routine. The end is what matters and it is
// why the card has a completion latch at all: the handle reports
// `session_complete` for a single sample, wipes its brushing timer to 0 in the
// same instant, and then switches itself off. Anything derived from the
// post-session state alone therefore sees nothing - only the observed
// active -> inactive transition carries the finished session over. The mode is
// not in this one; it was taken before the recorder read 0x4022.
//
// HX6340 Kids, also a full routine, and different in three ways that matter:
// it is the only line divided into four sectors rather than six, the
// integration creates no brushing_state sensor for it at all, so the card has
// to work from handle_state alone, and the recording was started before the
// handle was switched on, so it carries the beginning of a session that the
// Prestige capture is missing.
//
// HX999X Prestige again, this time on White+ and with the mode recorded. This
// is the one that matters most: a 160 s routine spread over an eight-step
// visit sequence, so the handle walks all six sectors and then returns to two
// of them. That backwards jump is the only reason the card carries a
// Sonicare-specific branch, and until this recording it was only ever checked
// against the derivation rather than against a real session.

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
const WHITE = loadSession(
    new URL('./fixtures/sonicare-hx999x-whiteplus-complete.jsonl', import.meta.url));

describe('the recorded HX999X session', () => {
    test('is a complete two-minute routine, of an unrecorded mode', () => {
        assert.equal(SESSION.meta.model, 'HX999X');
        const start = stateAt(SESSION, 2);
        assert.equal(start.routine_length, 120);
        assert.equal(start.handle_state, 'run');
        assert.equal(start.brushing_state, 'on');

        // The mode is genuinely absent. This capture predates the recorder
        // reading 0x4022, and on a Prestige that is the only characteristic
        // carrying the selected routine - 0x4080 reads 0 here, which the
        // sequential table would misreport as "clean". It was described as a
        // Clean session and the 120 s routine fits one, but the recording
        // cannot prove it, so nothing here claims otherwise.
        assert.equal(start.brushing_mode, null);
        assert.ok(!SESSION.events.some(e => e.char === 'available_routine_ids'));
    });

    test('still derives sectors correctly without a known mode', () => {
        // An unknown mode falls back to spreading the routine evenly over the
        // model's sectors, which for six zones is the same walk Clean makes -
        // so the missing mode costs this fixture nothing.
        const seen = [];
        // From 2 s, once every baseline read has landed.
        for (let t = 2; t < 92; t += 1) {
            const s = sectorState(stateAt(SESSION, t), 'HX999X');
            if (seen.at(-1) !== s) seen.push(s);
        }
        assert.deepEqual(seen, ['sector_2', 'sector_3', 'sector_4', 'sector_5', 'sector_6'],
            'starting at sector 2 because the capture joins 28 s in');
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

describe('the recorded HX999X White+ session', () => {
    test('reports its mode through the routine-id characteristic', () => {
        // 0x4080 reads 0 here, which the sequential table would call "clean".
        // On a Prestige the selected mode is the mode-id byte in 0x4022, and
        // reading the wrong one makes every routine look like Clean.
        assert.equal(WHITE.meta.model, 'HX999X');
        const raw = WHITE.events.find(e => e.char === 'available_routine_ids');
        assert.equal(raw.hex, '01');
        assert.equal(stateAt(WHITE, 10).brushing_mode, 'white_plus');
    });

    test('runs a longer routine than Clean does', () => {
        assert.equal(stateAt(WHITE, 10).routine_length, 160,
            'White+ is 160 s, against the 120 s of the Clean capture');
    });

    test('visits the front-teeth sectors a second time', () => {
        const seen = [];
        for (let t = 6; t < 165; t += 1) {
            const s = sectorState(stateAt(WHITE, t), 'HX999X');
            if (seen.at(-1) !== s) seen.push(s);
        }
        assert.deepEqual(seen, [
            'sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5',
            'sector_6', 'sector_2', 'sector_5',
        ], 'the derived sequence, now confirmed against a real session');
    });
});

describe('the card replaying the White+ session', () => {
    test('keeps completed zones done when the sector jumps back', async () => {
        // The Sonicare-only branch in the card exists for exactly this: the
        // raw sector falls from 6 back to 2, and a plain index-based progress
        // marking would drop four finished zones on the floor.
        const Card = await loadCard();
        const { rows } = await replaySession(Card, WHITE);

        const active = rows.filter(r => r.card && r.card.activeIndex >= 0);
        const revisit = active.findIndex((r, i) =>
            i > 0 && r.card.activeIndex < active[i - 1].card.activeIndex);
        assert.ok(revisit > 0, 'the recording contains a backwards jump');

        const before = active[revisit - 1].card;
        const after = active[revisit].card;
        assert.ok(before.activeIndex > after.activeIndex,
            `expected a jump back, got ${before.activeIndex} -> ${after.activeIndex}`);
        assert.ok(after.done >= before.done,
            `done zones fell from ${before.done} to ${after.done} across the revisit`);
    });

    test('never loses a done zone at any point of the session', async () => {
        const Card = await loadCard();
        const { rows } = await replaySession(Card, WHITE);
        let peak = 0;
        let last = null;
        for (const row of rows) {
            if (!row.card || row.card.sector === 'success') continue;
            assert.ok(row.card.done >= peak,
                `done went backwards at t=${row.t}: ${peak} -> ${row.card.done}`);
            peak = Math.max(peak, row.card.done);
            last = row.card;
        }
        // Five, not six: the zone currently under the brush is marked
        // `brushing` rather than `done`, so a full set only appears once the
        // session is over and the sector reads `success`. What matters here is
        // that by the end every zone is accounted for as one or the other.
        assert.equal(peak, 5);
        assert.equal(last.done + last.brushing, 6,
            'every zone is either finished or being brushed');
    });

    test('latches the finished session against the 160 s routine', async () => {
        const Card = await loadCard();
        const { el } = await replaySession(Card, WHITE);
        assert.equal(el._sessionRoutineLength, 160);
        assert.equal(el._completed, true);
        assert.equal(el._completedIsFull, true);
    });
});
