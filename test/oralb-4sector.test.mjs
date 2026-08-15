// Replays two four-sector Oral-B handles, brushed at the same time.
//
// What these captures add over the contributed ones is the *last* zone of a
// four-sector brush. The iO Series 10 fixture covers six sectors, and the
// Series 6 fixture aborts in sector 2, so the fourth-of-four zone had no
// evidence behind it until now - and that zone is the one the handle names
// oddly: it reports sector byte quadrant 7, never 4. The six-sector capture
// does the same thing one zone later (1, 2, 3, 4, 5, 7), so "quadrant 7" is
// not a sector number at all but "the last one, whichever that is".
//
// oralb_ble resolves that against the brush's own sector count, so the card
// receives sector_4 here and sector_6 there. These tests pin that resolution
// down from real bytes rather than from a hand-written expectation.
//
// Neither capture can be repeated - the handles are no longer reachable.

import test, { describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { framesFromFixture, decodeFrame } from './helpers/oralb-integration.mjs';
import { replay } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';

const DENSE = new URL('./fixtures/oralb-4sector-offline-ending.json', import.meta.url);
const SPARSE = new URL('./fixtures/oralb-4sector-sparse.json', import.meta.url);

let dense;
let sparse;

before(() => {
    dense = framesFromFixture(DENSE);
    sparse = framesFromFixture(SPARSE);
});

describe('the last zone of a four-sector handle', () => {
    test('is broadcast as sector byte quadrant 7, not 4', () => {
        const quadrants = [...new Set(dense
            .map(f => decodeFrame(f.bytes, '1.1.3'))
            .filter(d => d.state === 'running')
            .map(d => d.sectorByte & 0x07))];

        assert.deepEqual(quadrants, [1, 2, 3, 7],
            'the fourth zone never announces itself as 4');
    });

    test('resolves to sector_4 once the sector count is applied', () => {
        const seen = [...new Set(dense
            .map(f => decodeFrame(f.bytes, '1.1.3'))
            .filter(d => d.state === 'running')
            .map(d => d.sectorState))];

        assert.deepEqual(seen, ['sector_1', 'sector_2', 'sector_3', 'sector_4']);
    });

    test('and did so on the older decoder too', () => {
        // The pre-2026.8 table mapped byte 7 directly. Four-sector handles were
        // never the broken case - sectors 5 and 6 were, which is why the
        // workaround exists at all.
        const seen = [...new Set(dense
            .map(f => decodeFrame(f.bytes, '1.1.0'))
            .filter((f, i) => decodeFrame(dense[i].bytes, '1.1.3').state === 'running')
            .map(d => d.sectorState))];

        assert.ok(seen.includes('sector_4'), `sector_4 missing from ${seen}`);
        assert.ok(!seen.some(s => s.startsWith('unknown')), `unknown codes in ${seen}`);
    });

    test('the second handle agrees, on six advertisements', () => {
        // Received badly enough that the zone changes are only visible as jumps
        // in the timer. It still has to decode to the same four zones.
        const seen = [...new Set(sparse
            .map(f => decodeFrame(f.bytes, '1.1.3'))
            .filter(d => d.state === 'running')
            .map(d => d.sectorState))];

        assert.deepEqual(seen, ['sector_1', 'sector_2', 'sector_3', 'sector_4']);
    });
});

describe('a handle that goes offline instead of resetting its timer', () => {
    test('still reaches the fourth zone on the card', async () => {
        const rows = await replay(dense, { generation: '1.1.3' });
        const running = rows.filter(r => r.decoded.state === 'running');
        const zones = [...new Set(running.map(r => r.card?.activeIndex))];

        assert.equal(running.at(-1).card.zoneCount, 4);
        assert.deepEqual(zones, [0, 1, 2, 3],
            'all four zones are highlighted in turn, the last one included');
    });

    test('counts the session as finished', async () => {
        // This capture ends with the brush simply gone: it never wipes its
        // brushing time, it stops advertising mid-summary. The recap has to
        // come from what was seen, because nothing announces the end.
        const rows = await replay(dense, { generation: '1.1.3' });
        const lastTime = rows.at(-1).decoded.brushTime;

        assert.ok(lastTime > 0, 'the timer really is never reset in this capture');
        assert.equal(rows.at(-1).decoded.state, 'post brushing statistics');
    });

    test('the derived finish fades once the frozen summary goes stale', async () => {
        // The frozen frame keeps its values forever; deriving `success` from
        // them without a freshness bound showed a permanent finished view
        // that neither dismissal nor the hold window could clear.
        const rows = await replay(dense, {
            generation: '1.1.3',
            config: { hold_completed: false },
            andThen: (el, renderAgain) => renderAgain(dense.at(-1), 2 * 60 * 60),
        });

        assert.equal(rows.at(-2).card.sector, 'success',
            'a fresh summary still reads as finished');
        assert.equal(rows.at(-1).card.sector, 'no_sector',
            'a summary frozen for two hours no longer does');
    });

    test('dismissing the recap dismisses the derived finish with it', async () => {
        const rows = await replay(dense, {
            generation: '1.1.3',
            andThen: (el, renderAgain) => {
                el._dismissHold();
                renderAgain(dense.at(-1), 5);
            },
        });

        assert.equal(rows.at(-2).card.sector, 'success');
        assert.equal(rows.at(-1).card.sector, 'no_sector',
            'the × left the derived finished view standing');
    });
});

describe('the summary state on the card', () => {
    test('is shown localized, not as the raw state string', async () => {
        // The built-in integration reports its states with spaces ("post
        // brushing statistics"); the locale keys are underscored. The slug
        // bridges the two — without it the raw string leaked onto the card.
        let el;
        await replay(dense, {
            generation: '1.1.3',
            andThen: (e, renderAgain) => { el = e; renderAgain(dense.at(-1), 0); },
        });
        const text = markup(el.render());
        assert.match(text, /Summary/);
        assert.doesNotMatch(text, /post brushing statistics/);
    });
});
