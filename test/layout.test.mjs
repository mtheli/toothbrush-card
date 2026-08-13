// The pure decision functions the card and the editor share.
//
// These need no card instance, no DOM and no device: they take a config or an
// entity map and return the arrangement both sides then agree on. They are
// imported from src/ in either target - index.js does not re-export them, so
// they are unreachable from the bundle, and running the same code twice would
// prove nothing.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    normalizeLayout, resolveLayoutForDevice, isMainStateEntity, handleIsPresent,
    LAYOUT_PROPS, CORNER_SLOTS,
} from '../src/toothbrush-card.js';

describe('isMainStateEntity', () => {
    const entity = (platform, extra) => ({
        platform, entity_id: 'sensor.x', ...extra,
    });

    test('matches the main entity of every supported integration', () => {
        assert.ok(isMainStateEntity(entity('oralb', { translation_key: 'toothbrush_state' })));
        assert.ok(isMainStateEntity(entity('oralb_live', { translation_key: 'toothbrush_state' })));
        assert.ok(isMainStateEntity(entity('philips_sonicare_ble', { translation_key: 'handle_state' })));
    });

    test('xiaomi_ble is matched by entity_id, because it has no translation_key', () => {
        assert.ok(isMainStateEntity({ platform: 'xiaomi_ble', entity_id: 'sensor.mi_toothbrush' }));
        assert.ok(!isMainStateEntity({ platform: 'xiaomi_ble', entity_id: 'sensor.mi_score' }));
    });

    test('laifen_ble is matched either way, because 3.0.3 moved to keys', () => {
        // <= 3.0.2: no translation_key, always English entity_ids.
        assert.ok(isMainStateEntity({ platform: 'laifen_ble', entity_id: 'sensor.laifen_status' }));
        // >= 3.0.3 on a German install: localised id, but a key to match on.
        assert.ok(isMainStateEntity({
            platform: 'laifen_ble', entity_id: 'sensor.laifen_zustand',
            translation_key: 'status',
        }));
    });

    test('sub-devices and unknown integrations are not main entities', () => {
        // A Sonicare brush head carries its own entities but is not a handle.
        assert.ok(!isMainStateEntity(entity('philips_sonicare_ble', { translation_key: 'brushhead_wear' })));
        assert.ok(!isMainStateEntity(entity('some_other_integration', { translation_key: 'handle_state' })));
        assert.ok(!isMainStateEntity({ platform: undefined, entity_id: 'sensor.x' }));
    });
});

describe('normalizeLayout', () => {
    test('an absent layout keeps the historical arrangement', () => {
        const layout = normalizeLayout({});
        assert.deepEqual(layout.chips, ['battery', 'pressure', 'mode']);
        assert.deepEqual(layout.corners, { top_right: 'brush_head' });
        assert.equal(layout.defaulted, true,
            'the marker that lets a device-specific default replace it');
    });

    test('a malformed layout falls back to the same default', () => {
        for (const raw of [null, undefined, false, 'nonsense', 42]) {
            assert.equal(normalizeLayout({ layout: raw }).defaulted, true, `for ${JSON.stringify(raw)}`);
        }
    });

    test('layout: [] yields an empty layout, not the default', () => {
        // An array passes the `typeof raw === 'object'` guard, so it takes the
        // normal path and finds neither chips nor corners. The result is a card
        // with no chips at all - the same as an explicit `layout: {chips: []}`.
        // Recorded here as the current behaviour; whether a YAML `layout: []`
        // should mean "empty" or "malformed" is a product decision, not
        // something this test settles.
        const layout = normalizeLayout({ layout: [] });
        assert.deepEqual(layout.chips, []);
        assert.deepEqual(layout.corners, {});
        assert.equal(layout.defaulted, undefined);
    });

    test('an explicit layout is not marked as defaulted', () => {
        assert.equal(normalizeLayout({ layout: { chips: ['battery'] } }).defaulted, undefined);
    });

    test('the chip row is capped at four', () => {
        const layout = normalizeLayout({
            layout: { chips: ['battery', 'pressure', 'mode', 'score', 'brush_head'] },
        });
        assert.equal(layout.chips.length, 4);
        assert.deepEqual(layout.chips, ['battery', 'pressure', 'mode', 'score']);
    });

    test('a property appears once across chips and corners, first wins', () => {
        const layout = normalizeLayout({
            layout: { chips: ['battery', 'battery', 'mode'], corners: { top_left: 'mode' } },
        });
        assert.deepEqual(layout.chips, ['battery', 'mode']);
        assert.deepEqual(layout.corners, {}, 'the corner loses to the chip');
    });

    test('unknown properties and unknown slots are dropped', () => {
        const layout = normalizeLayout({
            layout: {
                chips: ['battery', 'not_a_property'],
                corners: { top_left: 'score', middle: 'mode', bottom_right: 'nope' },
            },
        });
        assert.deepEqual(layout.chips, ['battery']);
        assert.deepEqual(layout.corners, { top_left: 'score' });
    });

    test('every documented property and slot is actually accepted', () => {
        // Guards the two lists against drifting apart from the code that reads
        // them - a property listed but rejected would fail silently in the UI.
        for (const prop of LAYOUT_PROPS) {
            assert.deepEqual(normalizeLayout({ layout: { chips: [prop] } }).chips, [prop], prop);
        }
        for (const slot of CORNER_SLOTS) {
            const layout = normalizeLayout({ layout: { corners: { [slot]: 'battery' } } });
            assert.deepEqual(layout.corners, { [slot]: 'battery' }, slot);
        }
    });
});

describe('resolveLayoutForDevice', () => {
    const base = () => normalizeLayout({});

    test('without a device map the layout is untouched', () => {
        const layout = base();
        assert.equal(resolveLayoutForDevice(layout, null), layout);
    });

    test('pressure becomes intensity on a handle that only reports intensity', () => {
        const resolved = resolveLayoutForDevice(base(), { intensity: 'sensor.i' });
        assert.deepEqual(resolved.chips, ['battery', 'intensity', 'mode']);
    });

    test('a handle reporting both keeps what was asked for', () => {
        const resolved = resolveLayoutForDevice(base(), {
            pressure: 'sensor.p', intensity: 'sensor.i',
        });
        assert.deepEqual(resolved.chips, ['battery', 'pressure', 'mode']);
    });

    test('the categorical pressure_state also counts as pressure', () => {
        const resolved = resolveLayoutForDevice(base(), { pressure_state: 'sensor.ps' });
        assert.deepEqual(resolved.chips, ['battery', 'pressure', 'mode']);
    });

    test('a swap that collides with an explicit intensity drops the duplicate', () => {
        const layout = normalizeLayout({ layout: { chips: ['pressure', 'intensity', 'battery'] } });
        const resolved = resolveLayoutForDevice(layout, { intensity: 'sensor.i' });
        assert.deepEqual(resolved.chips, ['intensity', 'battery'],
            'pressure swaps onto intensity, which is already there');
    });

    test('a device with neither contact feedback nor a mode gets its own default', () => {
        // Xiaomi: battery, score and a head reading, nothing else.
        const resolved = resolveLayoutForDevice(base(), { score: 'sensor.s' });
        assert.deepEqual(resolved.chips, ['battery', 'score', 'brush_head']);
        assert.deepEqual(resolved.corners, {});
    });

    test('that device-specific default never overrides an explicit layout', () => {
        const layout = normalizeLayout({ layout: { chips: ['battery', 'mode'] } });
        const resolved = resolveLayoutForDevice(layout, { score: 'sensor.s' });
        assert.deepEqual(resolved.chips, ['battery', 'mode']);
    });

    test('a mode reading is enough to keep the classic default', () => {
        const resolved = resolveLayoutForDevice(base(), { score: 'sensor.s', mode: 'sensor.m' });
        assert.deepEqual(resolved.chips, ['battery', 'pressure', 'mode']);
    });
});

describe('deciding whether the handle is there', () => {
    const NOW = Date.parse('2026-08-13T12:00:00Z');
    const ago = (seconds) => new Date(NOW - seconds * 1000).toISOString();
    const ask = (over) => handleIsPresent({
        integration: 'oralb', connectionState: null, status: 'idle',
        lastUpdated: ago(5), now: NOW, ...over,
    });

    test('an explicit connection sensor is the whole answer', () => {
        // Sonicare and Laifen report the link themselves; nothing else is
        // consulted, not even a state that looks alive.
        assert.equal(ask({ connectionState: 'on', status: 'unavailable' }), true);
        assert.equal(ask({ connectionState: 'off', status: 'running' }), false);
    });

    test('an integration that connects is judged by availability', () => {
        // oralb_live holds the link and reports the handle unavailable when it
        // drops, so a readable state is a live link.
        assert.equal(ask({ integration: 'oralb_live', status: 'idle' }), true);
        assert.equal(ask({ integration: 'oralb_live', status: 'unavailable' }), false);
        assert.equal(ask({ integration: 'oralb_live', status: 'unknown' }), false);
    });

    test('a broadcasting handle is judged by when it was last heard', () => {
        // The bug this replaced: oralb freezes its last values and stays
        // available, so a brush switched off days ago read as connected.
        assert.equal(ask({ lastUpdated: ago(5) }), true);
        assert.equal(ask({ lastUpdated: ago(3600) }), false,
            'an hour of silence is not a connection');
    });

    test('and a readable state does not rescue it', () => {
        assert.equal(ask({ status: 'idle', lastUpdated: ago(86400) }), false,
            'the frozen state says nothing about the brush still being there');
    });

    test('a handle that has never been heard from is not there', () => {
        assert.equal(ask({ lastUpdated: null }), false);
        assert.equal(ask({ lastUpdated: 'nonsense' }), false);
    });

    test('the two Oral-B integrations answer differently on the same input', () => {
        // Same state, same silence - and the right answer differs, which is
        // exactly why this hangs off the integration rather than the reading.
        const silent = { status: 'idle', lastUpdated: ago(86400) };
        assert.equal(ask({ ...silent, integration: 'oralb' }), false);
        assert.equal(ask({ ...silent, integration: 'oralb_live' }), true);
    });
});
