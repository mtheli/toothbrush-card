// Simulates the Home Assistant Oral-B integration on top of a real capture.
//
// Ports the parts of the oralb_ble parser that decide what the card gets to
// see, for the two generations that matter:
//   "1.1.0" - what Home Assistant shipped up to 2026.7
//   "1.1.3" - what Home Assistant 2026.8 ships
// Byte layout, both sector decoders and the state table are transcribed from
// https://github.com/Bluetooth-Devices/oralb-ble (src/oralb_ble/parser.py).

import { readFileSync } from 'node:fs';

const STATES = {
    0: 'unknown', 1: 'initializing', 2: 'idle', 3: 'running', 4: 'charging',
    5: 'setup', 6: 'flight menu', 8: 'selection menu', 9: 'off',
    113: 'final test', 114: 'pcb test', 115: 'sleeping', 116: 'transport',
};

// <= 1.1.0: a hand-built table collected from real brushes. Sectors 5 and 6
// have no entry, and several bytes that mean "last sector" map to sector 4.
const SECTOR_MAP_1_1_0 = {
    1: 'sector 1', 9: 'sector 1',
    2: 'sector 2', 10: 'sector 2',
    3: 'sector 3', 11: 'sector 3', 19: 'sector 3', 27: 'sector 3',
    4: 'sector 4', 7: 'sector 4', 15: 'sector 4', 31: 'sector 4', 39: 'sector 4',
    41: 'success', 42: 'success', 43: 'success', 47: 'success', 55: 'success',
};

// >= 1.1.1: the quadrant lives in the low three bits, 0 means no quadrant and
// 7 is a "last quadrant" sentinel resolved through the reported sector count.
// Every byte value now resolves, so "unknown sector code N" cannot occur.
function decodeSector_1_1_3(sector, noOfSectors) {
    const quadrant = sector & 0x07;
    if (quadrant === 0) return 'no sector';
    if (quadrant === 7) {
        const count = (noOfSectors || 0) & 0x07;
        return `sector ${count || 4}`;
    }
    return `sector ${quadrant}`;
}

/** The enum options the sector sensor declares, per generation. */
export const SECTOR_OPTIONS = {
    '1.1.0': ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'success', 'no_sector'],
    '1.1.3': ['no_sector', 'sector_1', 'sector_2', 'sector_3', 'sector_4',
        'sector_5', 'sector_6', 'sector_7'],
};

/** Advertisements from a capture fixture (hex manufacturer data per frame). */
export function framesFromFixture(url) {
    const doc = JSON.parse(readFileSync(url, 'utf8'));
    return doc.frames.map(frame => ({
        ts: frame.ts,
        bytes: frame.hex.match(/../g).map(byte => parseInt(byte, 16)),
    }));
}

/** What the integration would publish for a single advertisement. */
export function decodeFrame(bytes, generation) {
    const state = STATES[bytes[3]] ?? `unknown state ${bytes[3]}`;
    const brushTime = bytes[5] * 60 + bytes[6];
    const sectorByte = bytes[8];
    const noOfSectors = bytes.length >= 11 ? bytes[10] : null;

    let sector;
    if (generation === '1.1.3') {
        sector = decodeSector_1_1_3(sectorByte, noOfSectors);
        // Added in 1.1.1: the sector only means something while brushing, so
        // anything but "running" reports no sector instead of the last one.
        if (state !== 'running') sector = 'no sector';
    } else {
        sector = SECTOR_MAP_1_1_0[sectorByte] ?? `unknown sector code ${sectorByte}`;
    }

    return {
        state,
        brushTime,
        sectorByte,
        noOfSectors,
        // Home Assistant turns the library's value into an enum entity state.
        sectorState: sector.replace(/ /g, '_'),
    };
}
