// What the editor writes into the card's config.
//
// The editor never renders here. Every control ends in one of a handful of
// handlers that build a new config object and dispatch `config-changed`, so
// the handlers are called directly and the emitted config is what gets
// asserted - the same thing Home Assistant would store in the dashboard.
//
// The recurring rule across all of them is that a default writes *no key*:
// leaving a setting alone must not litter the YAML, and switching back to the
// default has to remove the key again rather than pin it. That is easy to
// break one handler at a time and invisible until someone reads their config.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadEditor } from './helpers/replay.mjs';

/** An Oral-B-shaped device with a full set of readings. */
function hassWith(entries, devices) {
    const entities = {};
    const states = {};
    for (const [entityId, props] of entries) {
        const { state = 'unknown', device_class: deviceClass, ...rest } = props;
        entities[entityId] = { entity_id: entityId, device_id: 'dev1', ...rest };
        states[entityId] = {
            state,
            attributes: deviceClass ? { device_class: deviceClass } : {},
        };
    }
    return {
        language: 'en',
        locale: { language: 'en' },
        entities,
        states,
        devices: devices ?? { dev1: { id: 'dev1', name: 'IO Series 10', config_entries: ['ce1'] } },
    };
}

const ORALB = () => hassWith([
    ['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }],
    ['sensor.io_sector', { platform: 'oralb', translation_key: 'sector' }],
    ['sensor.io_sectors', { platform: 'oralb', translation_key: 'number_of_sectors', state: '6' }],
    ['sensor.io_mode', { platform: 'oralb', translation_key: 'mode' }],
    ['sensor.io_pressure', { platform: 'oralb', translation_key: 'pressure' }],
    ['sensor.io_battery', { platform: 'oralb', device_class: 'battery' }],
]);

/**
 * An editor bound to a config, with the configs it emits collected.
 *
 * `emitted` grows by one entry per change; `last()` is what Home Assistant
 * would have stored after the most recent one.
 */
async function editor(config = {}, hass = ORALB()) {
    const Editor = await loadEditor();
    const el = new Editor();
    el.requestUpdate = () => {};
    const emitted = [];
    el.dispatchEvent = (ev) => { emitted.push(ev.detail.config); return true; };
    el.hass = hass;
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', ...config });
    return { el, emitted, last: () => emitted.at(-1) };
}

describe('the device picker', () => {
    test('offers every device that carries a main state entity', async () => {
        const hass = hassWith([
            ['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }],
            ['sensor.s_handle', { platform: 'philips_sonicare_ble', translation_key: 'handle_state', device_id: 'dev2' }],
            ['sensor.s_wear', { platform: 'philips_sonicare_ble', translation_key: 'brushhead_wear', device_id: 'dev3' }],
        ], {
            dev1: { id: 'dev1', name: 'Oral-B' },
            dev2: { id: 'dev2', name: 'Sonicare' },
            dev3: { id: 'dev3', name: 'Brush Head' },
        });
        const { el } = await editor({}, hass);
        const options = el._deviceOptions();
        assert.deepEqual(options.map(o => o.value), ['dev1', 'dev2'],
            'the brush-head sub-device is not a device you can pick');
    });

    test('prefers the name the user gave a device', async () => {
        const hass = hassWith(
            [['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }]],
            { dev1: { id: 'dev1', name: 'IO Series 10', name_by_user: 'Bathroom brush' } },
        );
        const { el } = await editor({}, hass);
        assert.equal(el._deviceOptions()[0].label, 'Bathroom brush');
    });

    test('keeps a hand-configured device visible even if it does not qualify', async () => {
        // Otherwise a YAML-only device_id would silently read as "unknown
        // device selected" and the next save would drop it.
        const hass = hassWith(
            [['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }]],
            { dev1: { id: 'dev1', name: 'Oral-B' }, devX: { id: 'devX', name: 'Hand-picked' } },
        );
        const { el } = await editor({ device_id: 'devX' }, hass);
        const options = el._deviceOptions();
        assert.ok(options.some(o => o.value === 'devX' && o.label === 'Hand-picked'));
    });

    test('changing the device drops the settings tied to the old one', async () => {
        const { el, last } = await editor({
            num_sectors: 6,
            sector_order: [...Array(6)].map((_, i) => `zone${i}`),
            scale: 1.2,
        });
        el._deviceChanged({ detail: { value: 'dev2' } });
        assert.equal(last().device_id, 'dev2');
        assert.equal(last().num_sectors, undefined, 'sector count belongs to the old device');
        assert.equal(last().sector_order, undefined);
        assert.equal(last().scale, 1.2, 'but unrelated settings survive');
    });
});

describe('the sector count', () => {
    test('follows the device when nothing is configured', async () => {
        const { el } = await editor();
        assert.equal(el._getNumSectors(), 6, 'read from the number_of_sectors entity');
    });

    test('falls back to four without such an entity', async () => {
        const hass = hassWith([
            ['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }],
        ]);
        const { el } = await editor({}, hass);
        assert.equal(el._getNumSectors(), 4);
    });

    test('setting it to what the device already says writes no key', async () => {
        const { el, last } = await editor();
        el._numSectorsChanged('6');
        assert.equal(last().num_sectors, undefined,
            'no point pinning a value the device reports anyway');
    });

    test('setting it to anything else does write one', async () => {
        const { el, last } = await editor();
        el._numSectorsChanged('4');
        assert.equal(last().num_sectors, 4);
    });

    test('changing it always discards the zone order', async () => {
        // A six-zone order is meaningless on four zones.
        const { el, last } = await editor({ sector_order: ['a', 'b', 'c', 'd', 'e', 'f'] });
        el._numSectorsChanged('4');
        assert.equal(last().sector_order, undefined);
    });
});

describe('the zone order', () => {
    test('starts from the default for the device sector count', async () => {
        const { el } = await editor();
        assert.equal(el._sectorOrder.length, 6);
        assert.equal(el._sectorOrder[0], 'lower_left');
    });

    test('ignores a stored order of the wrong length', async () => {
        const { el } = await editor({ sector_order: ['upper_left', 'upper_right'] });
        assert.equal(el._sectorOrder.length, 6, 'two entries cannot describe six zones');
    });

    test('moving an entry up swaps it with its neighbour', async () => {
        const { el, last } = await editor();
        const before = el._sectorOrder;
        el._moveItem(2, -1);
        const after = last().sector_order;
        assert.equal(after[1], before[2]);
        assert.equal(after[2], before[1]);
        assert.deepEqual([...after].sort(), [...before].sort(), 'nothing gained or lost');
    });

    test('moving past either end does nothing at all', async () => {
        const { el, emitted } = await editor();
        el._moveItem(0, -1);
        el._moveItem(5, 1);
        assert.equal(emitted.length, 0, 'no config change, so no dashboard write');
    });

    test('dropping an entry reinserts it at the target position', async () => {
        const { el, last } = await editor();
        const before = el._sectorOrder;
        el._dragStart({ dataTransfer: {} }, 0);
        el._drop({ preventDefault() {} }, 3);
        const after = last().sector_order;
        assert.equal(after[3], before[0], 'the dragged zone landed where it was dropped');
        assert.equal(after[0], before[1], 'and the rest closed the gap');
        assert.deepEqual([...after].sort(), [...before].sort());
    });

    test('dropping an entry onto itself changes nothing', async () => {
        const { el, emitted } = await editor();
        el._dragStart({ dataTransfer: {} }, 2);
        el._drop({ preventDefault() {} }, 2);
        assert.equal(emitted.length, 0);
        assert.equal(el._dragIndex, -1, 'and the drag state is cleared either way');
    });

    test('resetting removes the key rather than writing the default', async () => {
        const { el, last } = await editor({ sector_order: ['a', 'b', 'c', 'd', 'e', 'f'] });
        el._resetOrder();
        assert.equal(last().sector_order, undefined);
    });
});

describe('the completed-session hold', () => {
    test('reads as the default when nothing is set', async () => {
        const { el } = await editor();
        assert.equal(el._holdValue(), '0.5');
    });

    test('reads as off when the recap is disabled', async () => {
        const { el } = await editor({ hold_completed: false });
        assert.equal(el._holdValue(), 'off');
    });

    test('choosing the default writes neither key', async () => {
        const { el, last } = await editor({ hold_duration: 4 });
        el._holdChanged('0.5');
        assert.equal(last().hold_duration, undefined);
        assert.equal(last().hold_completed, undefined);
    });

    test('choosing off writes only hold_completed', async () => {
        const { el, last } = await editor({ hold_duration: 4 });
        el._holdChanged('off');
        assert.equal(last().hold_completed, false);
        assert.equal(last().hold_duration, undefined, 'the two keys never coexist');
    });

    test('choosing a duration writes it as a number', async () => {
        const { el, last } = await editor({ hold_completed: false });
        el._holdChanged('4');
        assert.equal(last().hold_duration, 4);
        assert.equal(last().hold_completed, undefined);
    });

    test('until the next session is a real choice, not the default', async () => {
        const { el, last } = await editor();
        el._holdChanged('0');
        assert.equal(last().hold_duration, 0);
    });
});

describe('the badge verdict switch', () => {
    test('switching it off writes the key', async () => {
        const { el, last } = await editor();
        el._valueChanged('show_verdict', false);
        assert.equal(last().show_verdict, false);
    });

    test('switching it back on removes the key rather than writing the default', async () => {
        const { el, last } = await editor({ show_verdict: false });
        el._valueChanged('show_verdict', '');
        assert.equal(last().show_verdict, undefined,
            'a config that matches the default carries no key at all');
    });

    test('hides for a device with nothing to switch', async () => {
        const { el } = await editor();
        assert.equal(el._hasVerdictSource(), false,
            'a plain oralb device has neither a face nor a score to show');
    });

    test('shows for a device with a display face', async () => {
        const hass = ORALB();
        hass.entities['sensor.io_smiley'] = {
            entity_id: 'sensor.io_smiley', device_id: 'dev1',
            platform: 'oralb_live', translation_key: 'smiley',
        };
        const { el } = await editor({}, hass);
        assert.equal(el._hasVerdictSource(), true);
    });

    test('shows for a device with a session score', async () => {
        const hass = ORALB();
        hass.entities['sensor.io_score'] = {
            entity_id: 'sensor.io_score', device_id: 'dev1',
            platform: 'xiaomi_miio',
        };
        const { el } = await editor({}, hass);
        assert.equal(el._hasVerdictSource(), true);
    });

    test('ignores verdict sources on other devices', async () => {
        const hass = ORALB();
        hass.entities['sensor.other_smiley'] = {
            entity_id: 'sensor.other_smiley', device_id: 'dev2',
            platform: 'oralb_live', translation_key: 'smiley',
        };
        const { el } = await editor({}, hass);
        assert.equal(el._hasVerdictSource(), false);
    });
});

describe('the other defaults that write no key', () => {
    test('scale', async () => {
        const { el, last } = await editor({ scale: 1.4 });
        el._scaleChanged('1');
        assert.equal(last().scale, undefined);
        el._scaleChanged('1.25');
        assert.equal(last().scale, 1.3, 'and anything else is rounded to one decimal');
    });

    test('progress size', async () => {
        const { el, last } = await editor({ progress_size: 'thick' });
        el._progressSizeChanged('slim');
        assert.equal(last().progress_size, undefined);
        el._progressSizeChanged('thick');
        assert.equal(last().progress_size, 'thick');
    });

    test('an emptied text field drops its key entirely', async () => {
        const { el, last } = await editor({ title: 'Bathroom' });
        el._valueChanged('title', '');
        assert.ok(!('title' in last()), 'not an empty string left behind');
    });
});

describe('property placement', () => {
    test('only offers readings the device actually has', async () => {
        const { el } = await editor();
        const avail = el._availableSet(el._deviceIds());
        assert.ok(avail.has('battery') && avail.has('pressure') && avail.has('mode'));
        assert.ok(!avail.has('score'), 'this device reports no score');
        assert.ok(!avail.has('brush_head'), 'and has no head sensor');
    });

    test('drops a default slot the device cannot fill', async () => {
        // The stock layout puts the brush head in the top-right corner; on a
        // handle without that sensor the slot has to read as empty rather
        // than as something that would render blank.
        const { el } = await editor();
        assert.equal(el._editorLayout().corners.top_right, '');
    });

    test('a reading placed once is not offered a second time', async () => {
        const { el } = await editor();
        const used = el._usedElsewhere('chip0');
        assert.ok(used.has('pressure'), 'still placed in another chip');
        const opts = el._propOptions('battery', used, el._availableSet(el._deviceIds()));
        assert.ok(opts.some(o => o.value === 'battery'), 'the current value stays selectable');
        assert.ok(!opts.some(o => o.value === 'pressure'));
    });

    test('choosing none clears the slot without shifting the others', async () => {
        const { el, last } = await editor();
        const before = el._editorLayout().chips.filter(Boolean);
        el._layoutChipChanged(1, 'none');
        assert.deepEqual(last().layout.chips, before.filter((_, i) => i !== 1));
    });

    test('a corner is written only when it holds something', async () => {
        const { el, last } = await editor();
        el._layoutCornerChanged('bottom_left', 'mode');
        assert.deepEqual(last().layout.corners, { bottom_left: 'mode' },
            'the three empty corners are not written as empty strings');
    });

    test('resetting removes the layout key', async () => {
        const { el, last } = await editor();
        el._layoutChipChanged(0, 'none');
        assert.ok(last().layout, 'a layout was written');
        el._resetLayout();
        assert.equal(last().layout, undefined);
    });
});

describe('resetting everything', () => {
    test('knows whether there is anything to reset', async () => {
        const { el } = await editor();
        assert.equal(el._hasCustomOptions, false, 'type and device_id do not count');
        const custom = await editor({ scale: 1.2 });
        assert.equal(custom.el._hasCustomOptions, true);
    });

    // `confirm` is deliberately absent from the DOM shim rather than stubbed
    // to true there: a reset that wipes a config should never be waved through
    // by a test that forgot to say so. Each test answers it explicitly.
    const answering = (answer, body) => async () => {
        globalThis.confirm = () => answer;
        try {
            await body();
        } finally {
            delete globalThis.confirm;
        }
    };

    test('keeps the device and drops the rest', answering(true, async () => {
        const { el, last } = await editor({ scale: 1.2, title: 'Bathroom', hold_duration: 4 });
        el._resetAll();
        assert.deepEqual(last(), { type: 'custom:toothbrush-card', device_id: 'dev1' });
    }));

    test('does nothing when the confirmation is declined', answering(false, async () => {
        const { el, emitted } = await editor({ scale: 1.2 });
        el._resetAll();
        assert.equal(emitted.length, 0);
    }));
});
