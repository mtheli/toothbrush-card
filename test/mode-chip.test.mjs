// The mode selector has an absolutely positioned dropdown, but the element
// anchoring it must also be the chip the row sizes. A separate wrapper has a
// different box model from the other chips: their padding and borders are
// added outside flex-basis while the wrapped chip's are contained inside it,
// making the mode visibly narrower (most obvious in the iPhone HA app).

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';

function sonicareHass() {
    const entity = (id, translation_key) => ({
        entity_id: id, device_id: 'dev1', platform: 'philips_sonicare_ble', translation_key,
    });
    return {
        language: 'en',
        locale: { language: 'en' },
        devices: {
            dev1: { id: 'dev1', name: 'Sonicare', manufacturer: 'Philips', config_entries: ['ce1'] },
        },
        entities: {
            'sensor.s_state': entity('sensor.s_state', 'handle_state'),
            'sensor.s_battery': entity('sensor.s_battery', 'battery'),
            'sensor.s_pressure': entity('sensor.s_pressure', 'pressure_state'),
            'sensor.s_intensity': entity('sensor.s_intensity', 'intensity'),
            'select.s_mode': entity('select.s_mode', 'brushing_mode_select'),
        },
        states: {
            'sensor.s_state': { state: 'idle', attributes: {}, last_changed: null },
            'sensor.s_battery': { state: '93', attributes: { device_class: 'battery' }, last_changed: null },
            'sensor.s_pressure': { state: 'optimal', attributes: {}, last_changed: null },
            'sensor.s_intensity': { state: 'high', attributes: {}, last_changed: null },
            'select.s_mode': {
                state: 'clean', attributes: { options: ['clean', 'white_plus'] }, last_changed: null,
            },
        },
        callWS: async () => ({}),
    };
}

async function renderMode({ dropdown = false, chips = ['mode'] } = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false,
        layout: { chips },
    });
    el.hass = sonicareHass();
    el._showModeDropdown = dropdown;
    return { el, result: el.render() };
}

/** Find the dynamic value immediately following a static template fragment. */
function valueAfter(result, fragment) {
    if (Array.isArray(result)) {
        for (const item of result) {
            const found = valueAfter(item, fragment);
            if (found !== undefined) return found;
        }
    } else if (result && typeof result === 'object' && '_$litType$' in result) {
        const index = result.strings.findIndex(part => part.includes(fragment));
        if (index >= 0) return result.values[index];
        for (const value of result.values) {
            const found = valueAfter(value, fragment);
            if (found !== undefined) return found;
        }
    }
    return undefined;
}

describe('the selectable mode chip', () => {
    test('is itself the flex-row item, with no differently sized wrapper', async () => {
        const { result } = await renderMode();
        const html = markup(result);
        assert.match(html, /class="chip mode-chip-wrap selectable"/);
        assert.doesNotMatch(html, /class="mode-chip-wrap">\s*<div class="chip/);
    });

    test('still anchors the dropdown inside that chip', async () => {
        const { result } = await renderMode({ dropdown: true });
        const html = markup(result);
        assert.match(html, /class="chip mode-chip-wrap selectable"[\s\S]*class="mode-dropdown"/);
        assert.match(html, /White\+/);
    });

    test('the backdrop closes it without bubbling back to the chip', async () => {
        const { el, result } = await renderMode({ dropdown: true });
        const handler = valueAfter(result, 'class="dropdown-backdrop" @click="');
        let stopped = false;
        handler({ stopPropagation: () => { stopped = true; } });
        assert.equal(stopped, true, 'otherwise the chip click opens the dropdown again');
        assert.equal(el._showModeDropdown, false);
    });

    test('marks a four-chip row for its intermediate phone layout', async () => {
        const { result } = await renderMode({
            chips: ['battery', 'pressure', 'mode', 'intensity'],
        });
        assert.match(markup(result), /class="chips-row four-chips"/);
    });

    test('keeps shrinking labels inside each equal-width chip', async () => {
        const Card = await loadCard();
        const css = Card.styles.cssText;
        assert.match(css, /grid-template-columns:\s*auto minmax\(0, 1fr\)/);
        assert.match(css, /\.chip-label\s*\{[\s\S]*?overflow:\s*hidden;[\s\S]*?text-overflow:\s*ellipsis;[\s\S]*?white-space:\s*nowrap;/);
        const fourChipRule = /\.chips-row\.four-chips \.chip\s*\{[^}]*grid-template-columns:\s*1fr;/;
        const threeRowRule = /\.chips-row\.four-chips \.chip\s*\{[^}]*grid-template-rows:\s*auto auto auto;/;
        assert.match(css, fourChipRule);
        assert.match(css, threeRowRule);
    });
});
