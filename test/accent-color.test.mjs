// Where the card's accent colour comes from.
//
// A brush that reports the colour of its own light ring lets the card match
// the handle standing in the bathroom, without anyone picking a colour twice.
// The rule is a precedence, and both ends of it matter: a colour written into
// the configuration is a decision and must never be overruled by a device,
// while a card left alone must follow the handle rather than paint white.
//
// The value passes straight into an inline style, so anything that is not a
// colour has to be rejected here rather than downstream: a sensor reads
// `unknown` before its first connection and `unavailable` whenever the
// integration drops out, and both would otherwise reach the stylesheet.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { findDeviceEntities, readRingColor, resolveAccentColor,
         DEFAULT_ACCENT_COLOR } from '../src/toothbrush-card.js';
import { loadCard, loadEditor } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';

/**
 * A `hass` carrying one brush on `dev1`, plus whatever else is passed in.
 *
 * `extra` entries are `[entity_id, { ...registry props, state }]` and may name
 * another `device_id`, which is how the charging station's own ring colour is
 * put where it really sits: on a second device of the same config entry.
 */
function hassWith(extra = []) {
    const entities = {};
    const states = {};
    const rows = [
        ['sensor.io_state', { platform: 'oralb_live', translation_key: 'toothbrush_state' }],
        ...extra,
    ];
    for (const [entityId, props] of rows) {
        const { state = 'unknown', device_id: deviceId = 'dev1', ...rest } = props;
        entities[entityId] = { entity_id: entityId, device_id: deviceId, ...rest };
        states[entityId] = { state, attributes: {} };
    }
    return {
        language: 'en',
        entities,
        states,
        devices: {
            dev1: { id: 'dev1', name: 'iO Series Toothbrush 2D64', config_entries: ['ce1'] },
            dev2: { id: 'dev2', name: 'iO Sense', config_entries: ['ce1'] },
        },
    };
}

const withRing = (state) => hassWith([
    ['sensor.io_ring', { platform: 'oralb_live', translation_key: 'ring_color', state }],
]);

describe('the ring colour entity', () => {
    test('is mapped from its translation_key', () => {
        const ids = findDeviceEntities(withRing('#0F5BCC'), 'dev1');
        assert.equal(ids.ring_color, 'sensor.io_ring');
    });

    test('is absent for a brush that reports no ring colour', () => {
        const ids = findDeviceEntities(hassWith(), 'dev1');
        assert.equal(ids.ring_color, null);
    });

    // The charging station publishes the colour of *its* ring under a key of
    // its own, on its own device. The card follows the handle the user picked,
    // so that entity must not be picked up - not even through the related-device
    // search that finds brush heads on a sibling device of the same entry.
    test('is not taken from the charging station beside it', () => {
        const hass = hassWith([
            ['sensor.charger_ring', {
                platform: 'oralb_live', translation_key: 'charger_ring_color',
                device_id: 'dev2', state: '#00FF00',
            }],
        ]);
        assert.equal(findDeviceEntities(hass, 'dev1').ring_color, null);
    });
});

describe('reading the ring colour', () => {
    test('takes a six-digit hex colour', () => {
        assert.equal(readRingColor(withRing('#0F5BCC'), { ring_color: 'sensor.io_ring' }),
            '#0F5BCC');
    });

    test('takes it however the integration cased it', () => {
        assert.equal(readRingColor(withRing('#b2091a'), { ring_color: 'sensor.io_ring' }),
            '#b2091a');
    });

    for (const state of ['unknown', 'unavailable', '', 'none', '#FFF', '#GGGGGG',
        'rgb(1,2,3)', '0F5BCC', '#0F5BCC00']) {
        test(`rejects ${JSON.stringify(state)}`, () => {
            assert.equal(readRingColor(withRing(state), { ring_color: 'sensor.io_ring' }), null);
        });
    }

    test('rejects a mapping without the entity', () => {
        assert.equal(readRingColor(withRing('#0F5BCC'), {}), null);
    });
});

describe('the accent colour', () => {
    const ids = { ring_color: 'sensor.io_ring' };

    test('follows the ring when the configuration names none', () => {
        assert.equal(resolveAccentColor({}, withRing('#0F5BCC'), ids), '#0F5BCC');
    });

    test('keeps a configured colour even when the brush reports one', () => {
        assert.equal(resolveAccentColor({ accent_color: '#FFDC00' }, withRing('#0F5BCC'), ids),
            '#FFDC00');
    });

    // Clearing the field in the editor writes an empty string rather than
    // dropping the key, and that means "follow the brush", not "paint ''".
    test('treats an empty configured colour as unset', () => {
        assert.equal(resolveAccentColor({ accent_color: '' }, withRing('#0F5BCC'), ids),
            '#0F5BCC');
        assert.equal(resolveAccentColor({ accent_color: '   ' }, withRing('#0F5BCC'), ids),
            '#0F5BCC');
    });

    test('falls back to the default when the ring reads nothing usable', () => {
        assert.equal(resolveAccentColor({}, withRing('unavailable'), ids), DEFAULT_ACCENT_COLOR);
        assert.equal(resolveAccentColor({}, hassWith(), {}), DEFAULT_ACCENT_COLOR);
    });
});

describe('the card', () => {
    /** A card bound to `dev1`, ready to be handed a `hass`. */
    async function card(config = {}) {
        const Card = await loadCard();
        const el = new Card();
        el.requestUpdate = () => {};
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', ...config });
        return el;
    }

    test('paints the ring colour', async () => {
        const el = await card();
        el.hass = withRing('#0F5BCC');
        assert.match(el._cardStyle(), /--accent-color: #0F5BCC/);
    });

    test('paints the configured colour instead', async () => {
        const el = await card({ accent_color: '#FFDC00' });
        el.hass = withRing('#0F5BCC');
        assert.match(el._cardStyle(), /--accent-color: #FFDC00/);
    });

    test('paints the default for a brush without a ring colour', async () => {
        const el = await card();
        el.hass = hassWith();
        assert.match(el._cardStyle(), new RegExp(`--accent-color: ${DEFAULT_ACCENT_COLOR}`));
    });

    // The colour is settable from the manufacturer's own app, so it can change
    // under a card that is already on screen. Nothing may have to be
    // reconfigured or remounted for that to show.
    test('follows a colour the handle changes later', async () => {
        const el = await card();
        el.hass = withRing('#0F5BCC');
        assert.match(el._cardStyle(), /--accent-color: #0F5BCC/);
        el.hass = withRing('#B2091A');
        assert.match(el._cardStyle(), /--accent-color: #B2091A/);
    });

    test('survives the sensor going unavailable', async () => {
        const el = await card();
        el.hass = withRing('#0F5BCC');
        el.hass = withRing('unavailable');
        assert.match(el._cardStyle(), new RegExp(`--accent-color: ${DEFAULT_ACCENT_COLOR}`));
    });
});

describe('the editor', () => {
    async function editor(hass, config = {}) {
        const Editor = await loadEditor();
        const el = new Editor();
        el.requestUpdate = () => {};
        el.hass = hass;
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', ...config });
        return el;
    }

    test('offers the ring colour as the hint under the swatches', async () => {
        const el = await editor(withRing('#0F5BCC'));
        assert.equal(el._ringColor(), '#0F5BCC');
    });

    // The hint promises the card will follow a colour, so it may only appear
    // where the card actually would.
    test('says nothing for a brush that reports no colour', async () => {
        assert.equal((await editor(hassWith()))._ringColor(), null);
        assert.equal((await editor(withRing('unknown')))._ringColor(), null);
    });

    // The hint exists only inside render(), so the markup is the only place
    // its presence and its absence can be read.
    test('puts the colour under the swatches, and nothing there without one',
        async () => {
            assert.match(markup((await editor(withRing('#0F5BCC'))).render()),
                /ring-swatch[\s\S]*#0F5BCC/);
            assert.doesNotMatch(markup((await editor(hassWith())).render()),
                /ring-swatch/);
        });
});
