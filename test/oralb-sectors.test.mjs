// Replays a real six-sector Oral-B session through the built card.
//
// The capture comes from an iO Series 10 contributed by @smartmatic in issue #3
// - the same data that backed the upstream fix Bluetooth-Devices/oralb-ble#180.
// It is replayed twice: once as Home Assistant <= 2026.7 saw it (oralb-ble
// 1.1.0) and once as 2026.8 sees it (1.1.3), which is exactly the split the
// card has to straddle.

import test, { describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { framesFromFixture, decodeFrame } from './helpers/oralb-integration.mjs';
import { replay } from './helpers/replay.mjs';

const FIXTURE = new URL('./fixtures/oralb-io10-issue3.json', import.meta.url);

// The fixture holds two sessions. The second is the complete two-minute run
// through all six sectors, up to the idle advertisement that ends it; the
// first ends early and contains a repeated advertisement that briefly reports
// a lower sector than the one before. The tail after the full session is the
// brush wiping its session counters a few seconds later.
const SESSION_2_START = '2026-05-23 09:03:45';
const SESSION_2_END = '2026-05-23 09:06:00';

let frames;
let fullSession;
let abortedSession;
let afterCounterReset;

before(() => {
    frames = framesFromFixture(FIXTURE);
    abortedSession = frames.filter(f => f.ts < SESSION_2_START);
    fullSession = frames.filter(f => f.ts >= SESSION_2_START && f.ts <= SESSION_2_END);
    afterCounterReset = frames.filter(f => f.ts >= SESSION_2_START);
});

describe('oralb_ble sector decoding', () => {
    test('2026.8 resolves all six sectors of the routine', () => {
        const seen = fullSession
            .map(f => decodeFrame(f.bytes, '1.1.3'))
            .filter(d => d.state === 'running')
            .map(d => d.sectorState);

        assert.deepEqual([...new Set(seen)],
            ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5', 'sector_6']);
    });

    test('before 2026.8 sectors 5 and 6 were unreachable', () => {
        const seen = fullSession
            .map(f => decodeFrame(f.bytes, '1.1.0'))
            .filter((d, i) => fullSession[i] && decodeFrame(fullSession[i].bytes, '1.1.3').state === 'running')
            .map(d => d.sectorState);

        // Sector 5 fell through as an unknown code and sector 6 was reported as
        // sector 4 - the two symptoms the card's workaround had to cover.
        assert.ok(seen.includes('unknown_sector_code_5'));
        assert.ok(!seen.includes('sector_5'));
        assert.ok(!seen.includes('sector_6'));
    });

    test('2026.8 stops reporting a sector once the brush is idle', () => {
        const end = fullSession.map(f => decodeFrame(f.bytes, '1.1.3')).at(-1);
        assert.equal(end.state, 'idle');
        assert.equal(end.sectorState, 'no_sector');

        // The same advertisement used to be the one that announced the finish.
        assert.equal(decodeFrame(fullSession.at(-1).bytes, '1.1.0').sectorState, 'success');
    });
});

describe('card sector handling on Home Assistant 2026.8', () => {
    test('follows the reported sector through all six zones', async () => {
        const rows = await replay(fullSession, { generation: '1.1.3' });
        const brushing = rows.filter(r => r.decoded.state === 'running');

        for (const row of brushing) {
            const reported = Number(row.decoded.sectorState.replace('sector_', '')) - 1;
            assert.equal(row.card.activeIndex, reported,
                `${row.ts}: entity ${row.decoded.sectorState} rendered as index ${row.card.activeIndex}`);
        }
        assert.equal(Math.max(...brushing.map(r => r.card.activeIndex)), 5);
    });

    test('a repeated advertisement no longer advances the sector', async () => {
        // Regression guard: the pre-2026.8 workaround advanced whenever a
        // sector was not higher than the highest seen, so the duplicate frame
        // in this session pushed the card two zones past the truth.
        const rows = await replay(abortedSession, { generation: '1.1.3' });

        for (const row of rows.filter(r => r.decoded.state === 'running')) {
            const reported = Number(row.decoded.sectorState.replace('sector_', '')) - 1;
            assert.equal(row.card.activeIndex, reported,
                `${row.ts}: entity ${row.decoded.sectorState} rendered as index ${row.card.activeIndex}`);
        }
    });

    test('a finished routine reads as complete', async () => {
        for (const config of [{}, { hold_completed: false }]) {
            const rows = await replay(fullSession, { generation: '1.1.3', config });
            const end = rows.at(-1);

            assert.equal(end.decoded.sectorState, 'no_sector');
            assert.equal(end.card.sector, 'success',
                `hold_completed=${config.hold_completed !== false} left the finished session unmarked`);
            assert.equal(end.card.done, end.card.zoneCount);
            assert.equal(end.card.label, 'Complete');
        }
    });

    test('the finished view survives the brush wiping its counters', async () => {
        // Oral-B resets the session values seconds after powering off (#11).
        // The held recap rides that out; without the hold the card has nothing
        // left to show, which is the documented trade-off of that option.
        const held = await replay(afterCounterReset, { generation: '1.1.3' });
        assert.equal(held.at(-1).card.sector, 'success');

        const unheld = await replay(afterCounterReset, { generation: '1.1.3', config: { hold_completed: false } });
        assert.equal(unheld.at(-1).card.sector, 'no_sector');
    });
});

describe('card sector handling before Home Assistant 2026.8', () => {
    test('the workaround still carries the session past sector 4', async () => {
        const rows = await replay(fullSession, { generation: '1.1.0' });
        const brushing = rows.filter(r => r.decoded.state === 'running');

        // The entity never names sector 5 or 6 here, so the highlighted zone
        // can only reach the end of the mouth through the workaround.
        assert.equal(Math.max(...brushing.map(r => r.card.activeIndex)), 5);
        assert.ok(brushing.some(r => r.decoded.sectorState === 'unknown_sector_code_5'));
    });

    test('a finished routine still reads as complete', async () => {
        const rows = await replay(fullSession, { generation: '1.1.0' });
        const end = rows.at(-1);

        assert.equal(end.decoded.sectorState, 'success');
        assert.equal(end.card.sector, 'success');
        assert.equal(end.card.done, end.card.zoneCount);
    });
});
