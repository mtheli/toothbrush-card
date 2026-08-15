// Two captures from the August 2026 display-face work (issue #20), replayed
// through the card.
//
// The pause-carry capture pins down a behaviour no earlier fixture had: a
// paused handle settles on its current verdict face, and the frames after the
// pause carry that face while running. The card's sector handling has to see
// through that - the face lives in the same byte as the quadrant.
//
// The N=0 capture is from a handle that does not report its sector count at
// all, walks the quadrant-7 sentinel in overtime, and closes on byte 0x37 -
// face 6 plus the sentinel, the exact byte the pre-1.1.1 table listed as
// "success". One real session exercising the sector-count fallback, the
// sentinel resolution and the derived finish at once.

import test, { describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { framesFromFixture, decodeFrame } from './helpers/oralb-integration.mjs';
import { replay } from './helpers/replay.mjs';

const PAUSE_CARRY = new URL('./fixtures/oralb-pause-carry.json', import.meta.url);
const N0_OVERTIME = new URL('./fixtures/oralb-n0-overtime.json', import.meta.url);

let pauseCarry;
let n0Overtime;

before(() => {
    pauseCarry = framesFromFixture(PAUSE_CARRY);
    n0Overtime = framesFromFixture(N0_OVERTIME);
});

describe('a session with pauses carries the verdict face while running', () => {
    test('the raw bytes really do carry faces mid-run', () => {
        const faces = [...new Set(pauseCarry
            .map(f => decodeFrame(f.bytes, '1.1.3'))
            .filter(d => d.state === 'running')
            .map(d => (d.sectorByte >> 3) & 0x07))];
        assert.ok(faces.some(f => f > 0),
            'this capture exists because running frames carry a face after a pause');
    });

    test('2026.8 still resolves every frame to a plain quadrant', () => {
        // The face bits share the byte with the quadrant; the decoder masks
        // them off, so no frame may surface as an unknown sector.
        for (const frame of pauseCarry) {
            const d = decodeFrame(frame.bytes, '1.1.3');
            assert.doesNotMatch(d.sectorState, /unknown/,
                `byte 0x${d.sectorByte.toString(16)} leaked through the mask`);
        }
    });

    test('the card walks the zones and derives the finish', async () => {
        const rows = await replay(pauseCarry, { generation: '1.1.3' });
        const indices = [...new Set(rows
            .filter(r => r.decoded.state === 'running')
            .map(r => r.card.activeIndex))];
        assert.ok(indices.every(i => i >= 0 && i <= 3),
            `face-carrying bytes pushed the highlight out of range: ${indices}`);

        const end = rows.at(-1);
        assert.equal(end.card.sector, 'success',
            'a 136 s session ending on its summary reads as finished');
        assert.equal(end.card.done, end.card.zoneCount);
    });

    test('before 2026.8, the in-session verdict bytes were the workaround\'s problem', () => {
        // Byte 0x31 (face 6, quadrant 1) is not in the old literal table -
        // exactly the kind of frame that surfaced as "unknown sector code N"
        // in Home Assistant before the upstream decoder landed.
        const seen = pauseCarry.map(f => decodeFrame(f.bytes, '1.1.0').sectorState);
        assert.ok(seen.some(s => s.startsWith('unknown_sector_code')),
            'this capture contains a byte the old table could not name');
    });
});

describe('a handle that reports no sector count', () => {
    test('advertises number_of_sectors 0 throughout', () => {
        const counts = [...new Set(n0Overtime.map(f => decodeFrame(f.bytes, '1.1.3').noOfSectors))];
        assert.deepEqual(counts, [0]);
    });

    test('a pause-free run never changes its face mid-run', () => {
        const faces = [...new Set(n0Overtime
            .map(f => decodeFrame(f.bytes, '1.1.3'))
            .filter(d => d.state === 'running')
            .map(d => (d.sectorByte >> 3) & 0x07))];
        assert.deepEqual(faces, [0],
            'without a pause the verdict only appears in the closing frame');
    });

    test('the card falls back to four zones and finishes the overtime run', async () => {
        const rows = await replay(n0Overtime, { generation: '1.1.3' });
        const running = rows.filter(r => r.decoded.state === 'running');

        assert.equal(running.at(-1).card.zoneCount, 4,
            'a reported count of 0 must fall back to the four-zone default');
        assert.equal(Math.max(...running.map(r => r.card.activeIndex)), 3,
            'the quadrant-7 sentinel resolves to the last zone');

        const end = rows.at(-1);
        assert.equal(end.card.sector, 'success');
        assert.equal(end.card.done, 4);
    });

    test('the closing byte is the old table\'s "success" literal', () => {
        const last = decodeFrame(n0Overtime.at(-1).bytes, '1.1.3');
        assert.equal(last.sectorByte, 0x37);
        assert.equal(decodeFrame(n0Overtime.at(-1).bytes, '1.1.0').sectorState, 'success',
            'byte 55 was "success" before the split was understood');
    });
});
