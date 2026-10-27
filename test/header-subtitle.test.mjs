// The subtitle under the header is the device's name, as the editor's
// switch says. It used to be the model number, which reads the same on two
// brushes of one model; that is now only the fallback for a nameless device.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';

async function header(device) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false });
    const entity = (id, translation_key) => ({
        entity_id: id, device_id: 'dev1', platform: 'philips_sonicare_ble', translation_key,
    });
    el.hass = {
        language: 'en', locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', manufacturer: 'Philips', config_entries: ['ce1'], ...device } },
        entities: {
            'sensor.s_state': entity('sensor.s_state', 'handle_state'),
            'sensor.s_model': entity('sensor.s_model', 'model_number'),
        },
        states: {
            'sensor.s_state': { state: 'standby', attributes: {}, last_changed: null },
            'sensor.s_model': { state: 'HX999X', attributes: {}, last_changed: null },
        },
        callWS: async () => ({}),
    };
    const html = markup(el.render());
    return html.match(/class="header-sub">([^<]*)</)?.[1] ?? null;
}

test('the device name is the subtitle, not the model number', async () => {
    assert.equal(await header({ name: 'Prestige 9900' }), 'Prestige 9900');
});

test('a name the user gave the device comes first', async () => {
    assert.equal(await header({ name: 'Prestige 9900', name_by_user: 'Bathroom' }), 'Bathroom');
});

test('the model number stands in for a device without a name', async () => {
    assert.equal(await header({ name: null }), 'HX999X');
});

test('a name starting with the manufacturer loses that prefix', async () => {
    assert.equal(await header({ name: 'Philips Sonicare 9900' }), 'Sonicare 9900');
});
