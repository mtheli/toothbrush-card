// How a device's entities become the card's logical readings.
//
// findDeviceEntities is the seam every integration passes through: everything
// downstream works off the map it returns, and the editor uses it to decide
// which readings a device even offers. It is pure, so it is called directly
// here - no card instance, no DOM.
//
// The integration-shaped cases live next door: helpers/laifen-integration.mjs
// and helpers/sonicare-integration.mjs build whole registries as those
// integrations publish them. This file covers the mapping rules themselves,
// including the order-dependent ones that are easy to break by moving a
// branch.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { findDeviceEntities } from '../src/toothbrush-card.js';

/**
 * A `hass` with the given entities on device `dev1`.
 *
 * Each entry is `[entity_id, { platform, translation_key, device_class }]`.
 * Order matters for several rules, and object key order is preserved here, so
 * a test can express "this one was seen first".
 */
function hassWith(entries, { devices, extraEntities = [] } = {}) {
    const entities = {};
    const states = {};
    for (const [entityId, props] of [...entries, ...extraEntities]) {
        const { device_class: deviceClass, device_id: deviceId = 'dev1', ...rest } = props;
        entities[entityId] = { entity_id: entityId, device_id: deviceId, ...rest };
        states[entityId] = {
            state: 'unknown',
            attributes: deviceClass ? { device_class: deviceClass } : {},
        };
    }
    return {
        entities,
        states,
        devices: devices ?? { dev1: { id: 'dev1', config_entries: ['ce1'] } },
    };
}

describe('the main state entity', () => {
    test('is returned as base_entity, and status is always cleared', () => {
        // Surprising but load-bearing: `status` is a scratch slot during the
        // scan and is moved to `base_entity` at the end. Everything reading
        // the card's state uses base_entity, so a mapping that left it in
        // `status` would render a permanently unknown card.
        const ids = findDeviceEntities(hassWith([
            ['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }],
        ]), 'dev1');
        assert.equal(ids.base_entity, 'sensor.io_state');
        assert.equal(ids.status, null);
    });

    test('oralb_live maps through the same branch as the built-in oralb', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.io_state', { platform: 'oralb_live', translation_key: 'toothbrush_state' }],
            ['sensor.io_sector', { platform: 'oralb_live', translation_key: 'sector' }],
            ['sensor.io_mode', { platform: 'oralb_live', translation_key: 'mode' }],
        ]), 'dev1');
        assert.equal(ids.base_entity, 'sensor.io_state');
        assert.equal(ids.sector, 'sensor.io_sector');
        assert.equal(ids.mode, 'sensor.io_mode');
        assert.equal(ids.integration, 'oralb_live');
    });

    test('Sonicare reports it under handle_state instead', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.s_handle', { platform: 'philips_sonicare_ble', translation_key: 'handle_state' }],
        ]), 'dev1');
        assert.equal(ids.base_entity, 'sensor.s_handle');
    });

    test('without one, an entity named after the device stands in', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.brush', { platform: 'something_else' }],
        ]), 'dev1');
        assert.equal(ids.base_entity, 'sensor.brush',
            'an id with no underscore is treated as the device itself');
    });

    test('entities of other devices are ignored', () => {
        const ids = findDeviceEntities(hassWith(
            [['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }]],
            {
                extraEntities: [
                    ['sensor.other_sector', {
                        platform: 'oralb', translation_key: 'sector', device_id: 'dev2',
                    }],
                ],
            },
        ), 'dev1');
        assert.equal(ids.sector, null, 'the other device\'s sector is not adopted');
    });
});

describe('contact feedback', () => {
    test('pressure_state is kept apart from the raw pressure sensor', () => {
        // They land in different slots so the categorical reading can take
        // precedence downstream regardless of which entity is seen first.
        const ids = findDeviceEntities(hassWith([
            ['sensor.s_pressure', { platform: 'philips_sonicare_ble', translation_key: 'pressure' }],
            ['sensor.s_pressure_state', { platform: 'philips_sonicare_ble', translation_key: 'pressure_state' }],
        ]), 'dev1');
        assert.equal(ids.pressure, 'sensor.s_pressure');
        assert.equal(ids.pressure_state, 'sensor.s_pressure_state');
    });

    test('the order they are seen in does not change that', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.s_pressure_state', { platform: 'philips_sonicare_ble', translation_key: 'pressure_state' }],
            ['sensor.s_pressure', { platform: 'philips_sonicare_ble', translation_key: 'pressure' }],
        ]), 'dev1');
        assert.equal(ids.pressure, 'sensor.s_pressure');
        assert.equal(ids.pressure_state, 'sensor.s_pressure_state');
    });

    test('pressure_alert is not mapped, whichever order it arrives in', () => {
        // Not an oversight, and not to be "fixed" back. It used to be written
        // into the same slot as the raw grams sensor, both unconditionally, so
        // which one won came down to registry iteration order - and the grams
        // value would have put a number in a chip that shows a word.
        //
        // It could never be reached either way: philips_sonicare_ble gates the
        // alert and pressure_state on the same IMU service, so a handle with
        // the one always has the other, and pressure_state wins where the value
        // is read. Dropping it removes the ordering question rather than
        // answering it.
        const entities = [
            ['binary_sensor.s_alert', { platform: 'philips_sonicare_ble', translation_key: 'pressure_alert' }],
            ['sensor.s_pressure', { platform: 'philips_sonicare_ble', translation_key: 'pressure' }],
        ];
        for (const order of [entities, [...entities].reverse()]) {
            const ids = findDeviceEntities(hassWith(order), 'dev1');
            assert.equal(ids.pressure, 'sensor.s_pressure', 'always the grams sensor');
        }
    });

    test('the reading a real Sonicare ends up showing is the categorical one', () => {
        // All three exist together on a handle with the IMU service; only
        // pressure_state reaches the chip.
        const ids = findDeviceEntities(hassWith([
            ['sensor.s_pressure', { platform: 'philips_sonicare_ble', translation_key: 'pressure' }],
            ['binary_sensor.s_alert', { platform: 'philips_sonicare_ble', translation_key: 'pressure_alert' }],
            ['sensor.s_pressure_state', { platform: 'philips_sonicare_ble', translation_key: 'pressure_state' }],
        ]), 'dev1');
        assert.equal(ids.pressure_state, 'sensor.s_pressure_state');
        assert.equal(ids.pressure_state || ids.pressure, 'sensor.s_pressure_state',
            'the precedence the renderer applies');
    });

    test('intensity has its own slot', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.s_intensity', { platform: 'philips_sonicare_ble', translation_key: 'intensity' }],
        ]), 'dev1');
        assert.equal(ids.intensity, 'sensor.s_intensity');
        assert.equal(ids.pressure, null);
    });
});

describe('device_class fallbacks', () => {
    test('the first battery and the first duration win', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.a_battery', { platform: 'x', device_class: 'battery' }],
            ['sensor.b_battery', { platform: 'x', device_class: 'battery' }],
            ['sensor.a_time', { platform: 'x', device_class: 'duration' }],
            ['sensor.b_time', { platform: 'x', device_class: 'duration' }],
        ]), 'dev1');
        assert.equal(ids.battery, 'sensor.a_battery');
        assert.equal(ids.duration, 'sensor.a_time');
    });

    test('an explicit brushing_time beats the device_class guess', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.some_duration', { platform: 'philips_sonicare_ble', device_class: 'duration' }],
            ['sensor.s_brushing_time', {
                platform: 'philips_sonicare_ble', translation_key: 'brushing_time',
                device_class: 'duration',
            }],
        ]), 'dev1');
        assert.equal(ids.duration, 'sensor.s_brushing_time');
    });
});

describe('xiaomi_ble, which publishes no translation_keys', () => {
    const xiaomi = () => findDeviceEntities(hassWith([
        ['sensor.mi_toothbrush', { platform: 'xiaomi_ble' }],
        ['sensor.mi_score', { platform: 'xiaomi_ble' }],
        ['sensor.mi_consumable', { platform: 'xiaomi_ble' }],
        ['sensor.mi_battery', { platform: 'xiaomi_ble', device_class: 'battery' }],
    ]), 'dev1');

    test('readings are matched by entity_id suffix', () => {
        const ids = xiaomi();
        assert.equal(ids.base_entity, 'sensor.mi_toothbrush');
        assert.equal(ids.score, 'sensor.mi_score');
        assert.equal(ids.brushhead_wear, 'sensor.mi_consumable');
    });

    test('the head reading is flagged as remaining, not as wear', () => {
        // Xiaomi reports the percentage left; the card tracks wear and
        // inverts it where it is used. Losing this flag would show a fresh
        // head as worn out.
        assert.equal(xiaomi().brushhead_remaining, true);
    });

    test('battery still comes from the device class', () => {
        assert.equal(xiaomi().battery, 'sensor.mi_battery');
    });
});

describe('laifen_ble, whose branch is exclusive', () => {
    test('its brushing_time is a routine length, not an elapsed time', () => {
        // The whole reason that branch ends in `continue`: laifen_ble reuses
        // two translation_keys that mean something else further down. Its
        // `brushing_time` is the configured session length in minutes, while
        // the shared branch would read the key as elapsed seconds and map it
        // to `duration`. The card would then show a 3 next to a 2-minute
        // target and never reach a completed session.
        const ids = findDeviceEntities(hassWith([
            ['sensor.laifen_status', { platform: 'laifen_ble', translation_key: 'status' }],
            ['sensor.laifen_timer', { platform: 'laifen_ble', translation_key: 'timer' }],
            ['sensor.laifen_brushing_time', { platform: 'laifen_ble', translation_key: 'brushing_time' }],
        ]), 'dev1');

        assert.equal(ids.routine_length, 'sensor.laifen_brushing_time');
        assert.equal(ids.routine_length_minutes, true);
        assert.equal(ids.duration, 'sensor.laifen_timer',
            'the elapsed time comes from the timer sensor, nowhere else');
    });

    test('its mode exists as both sensor and select, and they stay apart', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.laifen_status', { platform: 'laifen_ble', translation_key: 'status' }],
            ['sensor.laifen_mode', { platform: 'laifen_ble', translation_key: 'mode' }],
            ['select.laifen_mode', { platform: 'laifen_ble', translation_key: 'mode' }],
        ]), 'dev1');
        assert.equal(ids.mode, 'sensor.laifen_mode');
        assert.equal(ids.mode_select, 'select.laifen_mode');
    });
});

describe('entities on sub-devices', () => {
    const devices = {
        dev1: { id: 'dev1', config_entries: ['ce1'] },
        head: { id: 'head', via_device_id: 'dev1', config_entries: ['ce1'] },
        conn: { id: 'conn', config_entries: ['ce1'] },
        alien: { id: 'alien', config_entries: ['ce2'] },
    };

    test('brush head and connection readings are found on related devices', () => {
        // Sonicare splits these off onto their own devices, reachable either
        // as a child (via_device_id) or as a sibling on the same config entry.
        const ids = findDeviceEntities(hassWith(
            [['sensor.s_handle', { platform: 'philips_sonicare_ble', translation_key: 'handle_state' }]],
            {
                devices,
                extraEntities: [
                    ['sensor.head_wear', { platform: 'philips_sonicare_ble', translation_key: 'brushhead_wear', device_id: 'head' }],
                    ['sensor.head_type', { platform: 'philips_sonicare_ble', translation_key: 'brushhead_type', device_id: 'head' }],
                    ['sensor.head_left', { platform: 'philips_sonicare_ble', translation_key: 'brushhead_sessions_left', device_id: 'head' }],
                    ['binary_sensor.conn_ble', { platform: 'philips_sonicare_ble', translation_key: 'ble_connected', device_id: 'conn' }],
                    ['binary_sensor.conn_bridge', { platform: 'philips_sonicare_ble', translation_key: 'esp_bridge_alive', device_id: 'conn' }],
                ],
            },
        ), 'dev1');

        assert.equal(ids.brushhead_wear, 'sensor.head_wear');
        assert.equal(ids.brushhead_type, 'sensor.head_type');
        assert.equal(ids.brushhead_sessions, 'sensor.head_left');
        assert.equal(ids.ble_connected, 'binary_sensor.conn_ble');
        assert.equal(ids.esp_bridge_alive, 'binary_sensor.conn_bridge');
    });

    test('a device from another config entry is not searched', () => {
        const ids = findDeviceEntities(hassWith(
            [['sensor.s_handle', { platform: 'philips_sonicare_ble', translation_key: 'handle_state' }]],
            {
                devices,
                extraEntities: [
                    ['sensor.alien_wear', { platform: 'philips_sonicare_ble', translation_key: 'brushhead_wear', device_id: 'alien' }],
                ],
            },
        ), 'dev1');
        assert.equal(ids.brushhead_wear, null);
    });

    test('a registry without devices is not a crash', () => {
        const hass = hassWith([
            ['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }],
        ]);
        delete hass.devices;
        assert.equal(findDeviceEntities(hass, 'dev1').base_entity, 'sensor.io_state');
    });
});

describe('the integration name', () => {
    test('is taken from the first entity that carries a platform', () => {
        const ids = findDeviceEntities(hassWith([
            ['sensor.io_state', { platform: 'oralb', translation_key: 'toothbrush_state' }],
            ['sensor.io_sector', { platform: 'oralb', translation_key: 'sector' }],
        ]), 'dev1');
        assert.equal(ids.integration, 'oralb',
            'the card branches on this for the Oral-B sector workaround');
    });
});
