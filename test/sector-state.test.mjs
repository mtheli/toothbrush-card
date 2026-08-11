// Sector resolution, tested as the function it now is.
//
// sector-correction.test.mjs stays where it is and keeps exercising the same
// logic through the card's methods - that is what proves the wiring survived.
// This file goes at resolveSector directly, which is the piece that was never
// reachable on its own: the three-way choice between decoding, revisiting and
// compensating, and the done-count arithmetic behind a revisit. Reaching that
// before meant replaying a whole Sonicare session.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    resolveSector, initialSectorState, parseRawSectorIndex, decodesAllSectors,
} from '../src/sector-state.js';

const ZONES = 6;

/** Defaults for a reading, so each test states only what it is about. */
const reading = (over = {}) => ({
    sector: 'no_sector',
    active: true,
    zoneCount: ZONES,
    duration: 0,
    routineLength: 120,
    allowsRevisits: false,
    sectorsAreUpstreamDecoded: false,
    ...over,
});

const resolve = (over, state = initialSectorState()) =>
    resolveSector(state, reading(over));

describe('reading a sector value', () => {
    test('1-based on the wire, 0-based in the card', () => {
        assert.equal(parseRawSectorIndex('sector_1'), 0);
        assert.equal(parseRawSectorIndex('sector_6'), 5);
    });

    test('anything without a number is no sector', () => {
        for (const value of ['no_sector', 'success', '', null, undefined]) {
            assert.equal(parseRawSectorIndex(value), -1, String(value));
        }
    });
});

describe('spotting an integration that decodes everything itself', () => {
    test('sector_5 among the options is the marker', () => {
        assert.equal(decodesAllSectors(['no_sector', 'sector_4', 'sector_5']), true);
        assert.equal(decodesAllSectors(['sector_1', 'sector_4', 'success']), false);
    });

    test('missing options are not a decoder', () => {
        // An unavailable entity has its attributes stripped, and falling back
        // to the workaround is the safe half of that guess.
        assert.equal(decodesAllSectors(undefined), false);
        assert.equal(decodesAllSectors(null), false);
    });
});

describe('a finished routine', () => {
    test('highlights nothing and leaves the state alone', () => {
        const before = initialSectorState();
        const { state, index, doneCount } = resolve({ sector: 'success' }, before);
        assert.equal(index, -1);
        assert.equal(doneCount, null);
        assert.equal(state, before, 'not even a copy - nothing to change');
    });
});

describe('an integration that decodes every sector', () => {
    test('is taken at its word', () => {
        assert.equal(resolve({ sector: 'sector_5', sectorsAreUpstreamDecoded: true }).index, 4);
    });

    test('is still clamped to the zones the card is drawing', () => {
        // A seven-sector reading on a six-zone layout would otherwise index
        // past the end of the drawing.
        assert.equal(resolve({ sector: 'sector_7', sectorsAreUpstreamDecoded: true }).index, 5);
    });

    test('clears the workaround latch, so a fallback starts clean', () => {
        // The entity going briefly unavailable drops the card back onto the
        // workaround; it must not resume mid-session from a stale peak.
        const carrying = { ...initialSectorState(), highestSector: 4, lastRawIndex: 4, wasActive: true };
        const { state } = resolve({ sector: 'sector_2', sectorsAreUpstreamDecoded: true }, carrying);
        assert.equal(state.highestSector, -1);
        assert.equal(state.lastRawIndex, -1);
        assert.equal(state.wasActive, false);
    });
});

describe('a handle that revisits sectors on purpose', () => {
    const revisit = (over) => resolve({ allowsRevisits: true, ...over });

    test('reports the zone it names, without correction', () => {
        assert.equal(revisit({ sector: 'sector_2', duration: 130 }).index, 1,
            'a jump back is real here, not a wrap to compensate for');
    });

    test('counts done zones from elapsed time', () => {
        // Half a 120 s routine over six zones is three finished.
        assert.equal(revisit({ sector: 'sector_4', duration: 60 }).doneCount, 3);
    });

    test('and never fewer than the zones actually visited', () => {
        // The point of the whole branch: after the sweep the raw sector jumps
        // back to 2, but all six zones have genuinely been brushed.
        let state = initialSectorState();
        for (const s of ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5', 'sector_6']) {
            state = resolveSector(state, reading({ sector: s, allowsRevisits: true, duration: 10 })).state;
        }
        const back = resolveSector(state,
            reading({ sector: 'sector_2', allowsRevisits: true, duration: 10 }));
        assert.equal(back.index, 1, 'zone 2 is under the brush again');
        assert.equal(back.doneCount, 6, 'and all six stay finished');
    });

    test('the visited zones are dropped when the handle stops', () => {
        let state = initialSectorState();
        for (const s of ['sector_1', 'sector_2']) {
            state = resolveSector(state, reading({ sector: s, allowsRevisits: true })).state;
        }
        const stopped = resolveSector(state,
            reading({ sector: 'sector_2', active: false, allowsRevisits: true }));
        assert.equal(stopped.state.visitedSectors, null);
        assert.equal(stopped.doneCount, 0, 'time has not moved either');
    });

    test('done zones never exceed the zones there are', () => {
        assert.equal(revisit({ sector: 'sector_3', duration: 500 }).doneCount, ZONES);
    });
});

describe('everything else, where the wrap has to be compensated', () => {
    test('walks on while the reading stalls', () => {
        let state = initialSectorState();
        const seen = [];
        for (const s of ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_3', 'sector_4']) {
            const step = resolveSector(state, reading({ sector: s }));
            state = step.state;
            seen.push(step.index);
        }
        assert.deepEqual(seen, [0, 1, 2, 3, 4, 5]);
    });

    test('marks progress by index alone', () => {
        assert.equal(resolve({ sector: 'sector_3' }).doneCount, null,
            'only the revisit path has more to say than "everything before"');
    });
});
