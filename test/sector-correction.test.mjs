// A characterisation of the sector-correction state machine.
//
// This is the second state machine inside render(), four mutable fields big:
// _highestSector, _lastRawIndex, _correctedIndex and _wasActive, plus the
// visited-sector set beside it. Like the completion latch it is updated as a
// side effect of rendering, and until now it was only ever reached indirectly,
// through the two Oral-B replays.
//
// What it is for: oralb_ble before Home Assistant 2026.8 had no entries for
// sectors 5 and 6, so a six-sector brush wrapped back to sector 4 instead of
// moving on. During brushing a sector only ever moves forward, so a value that
// does not exceed the highest one seen is read as "the next one" instead.
//
// A characterisation, not a specification: what it does today is written down
// so the extraction cannot change it unnoticed, including the parts that are
// merely how it happens to work - the caching on the last raw value, and an
// inactive handle getting the raw index back rather than -1.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';

const MAX = 5; // six zones, so the highest index is 5

/** A bare card - this machine needs neither hass nor a config. */
async function machine() {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    return el;
}

/** Feed raw sector indices while active, and collect what comes back. */
async function feed(rawIndices, { max = MAX } = {}) {
    const el = await machine();
    const out = rawIndices.map(raw => el._correctSectorIndex(raw, true, max));
    return { el, out };
}

describe('a session that reports every sector properly', () => {
    test('is passed through untouched', async () => {
        const { out } = await feed([0, 1, 2, 3, 4, 5]);
        assert.deepEqual(out, [0, 1, 2, 3, 4, 5]);
    });

    test('and the highest seen tracks along', async () => {
        const { el } = await feed([0, 1, 2]);
        assert.equal(el._highestSector, 2);
    });
});

describe('the wrap the workaround exists for', () => {
    test('a sector that stops moving is carried forward instead', async () => {
        // The brush is on sector 5 and 6, but the integration keeps saying 4
        // (index 3). Each repeat that follows a different value advances.
        const { out } = await feed([0, 1, 2, 3, 2, 3]);
        assert.deepEqual(out, [0, 1, 2, 3, 4, 5],
            'the card walks on while the reading stalls');
    });

    test('it never runs past the last zone', async () => {
        const { out } = await feed([0, 1, 2, 3, 2, 3, 2, 3]);
        assert.deepEqual(out.slice(-3), [5, 5, 5], 'clamped at the highest index');
    });

    test('a smaller count clamps correspondingly', async () => {
        const { out } = await feed([0, 1, 0, 1, 0, 1], { max: 3 });
        assert.deepEqual(out, [0, 1, 2, 3, 3, 3]);
    });
});

describe('the caching on the last raw value', () => {
    test('the identical reading twice in a row does not advance', async () => {
        // Oral-B advertises repeatedly without anything changing; without this
        // the card would march through the zones on its own.
        const { out } = await feed([0, 1, 1, 1, 1]);
        assert.deepEqual(out, [0, 1, 1, 1, 1]);
    });

    test('but the same value after a different one does', async () => {
        // This is the whole mechanism: 2 following 3 is not a repeat, it is
        // the wrap, so it counts as progress.
        const { out } = await feed([2, 3, 2]);
        assert.deepEqual(out, [2, 3, 4]);
    });
});

describe('leaving and re-entering a session', () => {
    test('an inactive handle gets the raw index back, not a corrected one', async () => {
        const el = await machine();
        el._correctSectorIndex(2, true, MAX);
        assert.equal(el._correctSectorIndex(4, false, MAX), 4,
            'passed straight through while idle');
    });

    test('and going inactive clears what was learned', async () => {
        const el = await machine();
        el._correctSectorIndex(3, true, MAX);
        el._correctSectorIndex(-1, false, MAX);
        assert.equal(el._highestSector, -1);
        assert.equal(el._lastRawIndex, -1);
        assert.equal(el._correctedIndex, -1);
    });

    test('a new session starts from scratch rather than from the old peak', async () => {
        const el = await machine();
        for (const raw of [0, 1, 2, 3]) el._correctSectorIndex(raw, true, MAX);
        el._correctSectorIndex(3, false, MAX);          // handle off
        assert.equal(el._correctSectorIndex(0, true, MAX), 0,
            'the rising edge resets, so zone 1 is zone 1 again');
    });

    test('the rising edge resets on its own, even with state still standing', async () => {
        // No sequence render() produces today reaches this: every path that
        // clears _wasActive also resets the three learned values, and going
        // inactive resets them anyway. The guard is therefore belt-and-braces
        // - but it is part of this machine's contract, and without a test the
        // guard can be deleted with nothing going red. Set up by hand for
        // exactly that reason.
        const el = await machine();
        for (const raw of [0, 1, 2]) el._correctSectorIndex(raw, true, MAX);
        el._wasActive = false;                    // as the upstream-decoded branch does
        assert.equal(el._highestSector, 2, 'the peak is still standing');

        assert.equal(el._correctSectorIndex(0, true, MAX), 0,
            'the edge resets first, so zone 1 reads as zone 1');
    });

    test('no sector while running resets too', async () => {
        // -1 means the entity reports no_sector - the routine has not started
        // or has just ended, and nothing learned so far still applies.
        const el = await machine();
        el._correctSectorIndex(2, true, MAX);
        assert.equal(el._correctSectorIndex(-1, true, MAX), -1);
        assert.equal(el._highestSector, -1);
    });
});

describe('the visited-sector set beside it', () => {
    test('counts distinct sectors while running', async () => {
        const el = await machine();
        assert.equal(el._trackVisitedSector(0, true), 1);
        assert.equal(el._trackVisitedSector(1, true), 2);
        assert.equal(el._trackVisitedSector(0, true), 2, 'a revisit is not a new zone');
    });

    test('ignores no_sector', async () => {
        const el = await machine();
        assert.equal(el._trackVisitedSector(-1, true), 0);
    });

    test('is thrown away when the handle stops', async () => {
        const el = await machine();
        el._trackVisitedSector(0, true);
        el._trackVisitedSector(1, true);
        assert.equal(el._trackVisitedSector(1, false), 0);
        assert.equal(el._visitedSectors, null);
        assert.equal(el._trackVisitedSector(3, true), 1, 'and starts empty next time');
    });
});

describe('deciding whether the workaround is needed at all', () => {
    const withOptions = (options) => ({
        states: { 'sensor.io_sector': { state: 'sector_1', attributes: options ? { options } : {} } },
    });

    test('an entity offering sector_5 has the upstream fix', async () => {
        const el = await machine();
        assert.equal(el._sectorEntityDecodesAllSectors(
            withOptions(['no_sector', 'sector_1', 'sector_5', 'sector_6']), 'sensor.io_sector'), true);
    });

    test('one that stops at sector_4 does not', async () => {
        const el = await machine();
        assert.equal(el._sectorEntityDecodesAllSectors(
            withOptions(['sector_1', 'sector_2', 'sector_3', 'sector_4', 'success']),
            'sensor.io_sector'), false);
    });

    test('an unavailable entity keeps the workaround on', async () => {
        // Attributes are stripped while an entity is unavailable, so the
        // options vanish. Falling back to the old behaviour is the safe half
        // of that guess.
        const el = await machine();
        assert.equal(el._sectorEntityDecodesAllSectors(withOptions(null), 'sensor.io_sector'), false);
    });

    test('no sector entity at all is not a decoder either', async () => {
        const el = await machine();
        assert.equal(el._sectorEntityDecodesAllSectors(withOptions(['sector_5']), null), false);
    });
});

describe('resetting the correction explicitly', () => {
    test('clears the three learned values but not the active flag', async () => {
        // render() does this when it finds the entity decoding all sectors
        // itself, so that a later fallback to the workaround starts clean.
        const el = await machine();
        for (const raw of [0, 1, 2]) el._correctSectorIndex(raw, true, MAX);
        assert.equal(el._wasActive, true);

        el._resetSectorCorrection();
        assert.equal(el._highestSector, -1);
        assert.equal(el._lastRawIndex, -1);
        assert.equal(el._correctedIndex, -1);
        assert.equal(el._wasActive, true, 'the caller clears that separately');
    });
});
