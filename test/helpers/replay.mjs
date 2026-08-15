// Drives the card with a captured advertisement stream.
//
// Which card: `npm test` loads src/ directly, so the tests run without a build
// and a failure points at a line in the source. `npm run test:dist` runs the
// same suite against the built bundle instead, so the artifact users actually
// install stays covered - that is what CI and a release check should use.
//
// src/ needs Parcel-isms resolved (bundle-text:, bare JSON, extensionless
// imports); helpers/src-loader.mjs does that. The bundle needs none of it, but
// package.json has no "type": "module", so it is handed to the loader as a
// data: URL rather than imported by path - it is fully self-contained, so
// nothing needs to resolve relative to it.

import './dom-shim.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { decodeFrame, SECTOR_OPTIONS } from './oralb-integration.mjs';

const DIST = new URL('../../dist/toothbrush-card.js', import.meta.url);
const SRC = new URL('../../src/index.js', import.meta.url);

let cardClass = null;

/** The <toothbrush-card> class, from src/ or from the built bundle. */
export async function loadCard() {
    if (cardClass) return cardClass;
    if (process.env.TOOTHBRUSH_CARD_TARGET === 'dist') {
        let source;
        try {
            source = await readFile(DIST, 'utf8');
        } catch {
            throw new Error(`${fileURLToPath(DIST)} is missing - run "npm run build" first.`);
        }
        await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    } else {
        try {
            await import(SRC.href);
        } catch (err) {
            if (err?.code === 'ERR_UNKNOWN_FILE_EXTENSION' || err?.code === 'ERR_MODULE_NOT_FOUND'
                || err?.code === 'ERR_IMPORT_ATTRIBUTE_MISSING') {
                throw new Error(
                    'src/ could not be imported - run the tests via "npm test", which '
                    + 'registers test/helpers/src-loader.mjs.',
                    { cause: err });
            }
            throw err;
        }
    }
    cardClass = globalThis.customElements.get('toothbrush-card');
    return cardClass;
}

/**
 * The <toothbrush-card-editor> class, from the same target as the card.
 *
 * Loading either one registers both, so this rides on loadCard() rather than
 * repeating the target handling. Unlike the exported pure functions the editor
 * class is reachable through the bundle, so its tests run against both.
 */
export async function loadEditor() {
    await loadCard();
    return globalThis.customElements.get('toothbrush-card-editor');
}

const DEVICE = { id: 'dev1', name: 'IO Series 10', manufacturer: 'Oral-B', config_entries: ['ce1'] };

// The entity set the Home Assistant Oral-B integration creates for a brush.
const ENTITIES = {
    'sensor.io_state': { entity_id: 'sensor.io_state', device_id: 'dev1', platform: 'oralb', translation_key: 'toothbrush_state' },
    'sensor.io_sector': { entity_id: 'sensor.io_sector', device_id: 'dev1', platform: 'oralb', translation_key: 'sector' },
    'sensor.io_number_of_sectors': { entity_id: 'sensor.io_number_of_sectors', device_id: 'dev1', platform: 'oralb', translation_key: 'number_of_sectors' },
    'sensor.io_time': { entity_id: 'sensor.io_time', device_id: 'dev1', platform: 'oralb', translation_key: 'time' },
};

function makeHass(decoded, generation, iso) {
    return {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: DEVICE },
        entities: ENTITIES,
        // Real Home Assistant states always carry last_updated alongside
        // last_changed; the card's freshness guards read the former.
        states: {
            'sensor.io_state': { state: decoded.state, attributes: {}, last_changed: iso, last_updated: iso },
            'sensor.io_sector': {
                state: decoded.sectorState,
                attributes: { device_class: 'enum', options: SECTOR_OPTIONS[generation] },
                last_changed: iso,
                last_updated: iso,
            },
            'sensor.io_number_of_sectors': { state: String(decoded.noOfSectors ?? ''), attributes: {}, last_changed: iso, last_updated: iso },
            'sensor.io_time': { state: String(decoded.brushTime), attributes: { device_class: 'duration' }, last_changed: iso, last_updated: iso },
        },
        // The tests disable the history recap, so this is never reached.
        callWS: async () => ({}),
    };
}

/**
 * Feed every advertisement through the card and report what it decided.
 *
 * Returns one row per frame: the integration's reading plus the sector, the
 * highlighted zone index, the zone states and the label the card derived from
 * it - captured by wrapping the two methods that receive them, so nothing has
 * to be read back out of the lit template.
 */
export async function replay(frames, { generation, config = {}, andThen } = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};        // there is no update cycle without a DOM
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false, ...config });

    let current = null;
    const baseGetSectorData = Object.getPrototypeOf(el)._getSectorData;
    const baseGetSectorLabel = Object.getPrototypeOf(el)._getSectorLabel;
    el._getSectorData = function (sector, activeIndex, sectorOrder, doneCount = null) {
        const zones = baseGetSectorData.call(this, sector, activeIndex, sectorOrder, doneCount);
        current = {
            sector,
            activeIndex,
            zoneCount: sectorOrder.length,
            done: Object.values(zones).filter(z => z.done).length,
            brushing: Object.values(zones).filter(z => z.brushing).length,
        };
        return zones;
    };
    el._getSectorLabel = function (sector, activeIndex, sectorOrder) {
        const label = baseGetSectorLabel.call(this, sector, activeIndex, sectorOrder);
        if (current) current.label = label;
        return label;
    };

    // The capture is from May 2026; anchor it to "just now" so the completion
    // hold (default half an hour) has not expired by the time it is replayed.
    const toMs = frame => Date.parse(frame.ts.replace(' ', 'T'));
    const offset = Date.now() - toMs(frames.at(-1)) - 1000;

    const rows = [];
    for (const frame of frames) {
        const decoded = decodeFrame(frame.bytes, generation);
        current = null;
        el.hass = makeHass(decoded, generation, new Date(toMs(frame) + offset).toISOString());
        el.render();
        rows.push({ ts: frame.ts, decoded, card: current });
    }
    // Lets a test look past the capture: re-render a frame as if its state
    // were `agedSeconds` old now — a handle frozen on its summary screen —
    // optionally after poking the element (a dismissal, a config change).
    if (andThen) {
        await andThen(el, (frame, agedSeconds = 0) => {
            const decoded = decodeFrame(frame.bytes, generation);
            current = null;
            el.hass = makeHass(decoded, generation,
                new Date(Date.now() - agedSeconds * 1000 - 1000).toISOString());
            el.render();
            rows.push({ ts: frame.ts, decoded, card: current });
        });
    }
    return rows;
}
