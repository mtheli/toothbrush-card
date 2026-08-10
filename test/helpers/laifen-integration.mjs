// Stands in for the Home Assistant Laifen integration (laifen_ble).
//
// There is nothing to decode here: laifen_ble connects to the handle and
// publishes entities, so what the card sees is an entity registry plus states -
// no advertisement stream like the Oral-B helper replays. Both are transcribed
// from https://github.com/UrbanTechIO/Laifen (custom_components/laifen_ble):
// sensor.py, number.py, strings.json and translations/de.json.
//
// Two generations matter, because the card has to straddle them:
//   "3.0.2" - entities are named with _attr_name, so they carry no
//             translation_key and their entity_ids are always English
//   "3.0.3" - entities are named with translation_key + strings.json, and
//             de.json ships with it, so a German install gets German
//             entity_ids and the suffix matching no longer bites
//
// And two models, because 3.0.3 splits them:
//   "wave"     - V1 (LFTB01). sensor.py registers every sensor for every
//                device but `available` only returns True for keys the handle
//                reports, so Brushing Duration is registered and permanently
//                unavailable here. Brushing Time is gone on V1 as of 3.0.3.
//                The duration is settable through the number entity only.
//   "wave-pro" - V2 Pro (LFTB02-S-412B). Reports the Brushing Duration key,
//                so the sensor carries it (in seconds), and it is the only
//                model with the over-pressure binary sensor.

const DEVICE = {
    id: 'dev1',
    name: 'Laifen Toothbrush',
    manufacturer: 'Laifen',
    config_entries: ['ce1'],
};

// entity_ids as Home Assistant derives them from the device name plus the
// entity name of the respective release/language - spelled out rather than
// slugified here, so the fixture stays readable and language-exact.
const ENTITIES = [
    { domain: 'sensor', key: 'status', en: 'status', de: 'status' },
    { domain: 'sensor', key: 'timer', en: 'timer', de: 'timer' },
    { domain: 'sensor', key: 'mode', en: 'mode', de: 'modus' },
    { domain: 'sensor', key: 'battery_level', en: 'battery_level', de: 'batteriestand', deviceClass: 'battery' },
    { domain: 'sensor', key: 'brushing_time', en: 'brushing_time', de: 'putzzeit' },
    { domain: 'sensor', key: 'brushing_duration', en: 'brushing_duration', de: 'putzdauer' },
    { domain: 'number', key: 'brushing_duration', en: 'brushing_duration_adjustment', de: 'putzdauer_einstellen' },
    { domain: 'number', key: 'vibration_strength', en: 'vibration_strength', de: 'vibrationsstarke' },
    { domain: 'select', key: 'mode', en: 'mode', de: 'modus' },
    { domain: 'switch', key: 'power', en: 'power', de: 'ein_aus' },
    { domain: 'switch', key: 'reminder_30s', en: '30s_reminder', de: '30_sekunden_erinnerung' },
    { domain: 'binary_sensor', key: 'connection', en: 'connection', de: 'verbindung' },
    // Wave Pro only from 3.0.3 on; 3.0.2 still registered it on every device.
    { domain: 'binary_sensor', key: 'over_pressure_active', en: 'pressing_too_hard', de: 'zu_starker_druck', proOnly: true },
];

function entityId(entity, language) {
    return `${entity.domain}.laifen_toothbrush_${language === 'de' ? entity.de : entity.en}`;
}

/**
 * The entity registry and states laifen_ble would publish.
 *
 * @param release          "3.0.2" or "3.0.3"
 * @param model            "wave" or "wave-pro"
 * @param language         install language, "en" or "de"
 * @param status           the Status sensor, capitalized as the integration writes it
 * @param timer            the synthetic Timer sensor, in seconds
 * @param routineMinutes   what the Brushing Duration number reads, null = never set
 */
export function laifenHass({
    release = '3.0.3', model = 'wave', language = 'en',
    status = 'Idle', timer = 0, routineMinutes = 3,
} = {}) {
    const pro = model === 'wave-pro';
    const entities = {};
    const states = {};

    for (const entity of ENTITIES) {
        if (entity.proOnly && !pro && release !== '3.0.2') continue;
        const id = entityId(entity, release === '3.0.2' ? 'en' : language);
        entities[id] = {
            entity_id: id,
            device_id: 'dev1',
            platform: 'laifen_ble',
            // 3.0.2 named everything with _attr_name and so has no keys at all.
            ...(release === '3.0.2' ? {} : { translation_key: entity.key }),
        };
        states[id] = {
            state: 'unavailable',
            attributes: entity.deviceClass ? { device_class: entity.deviceClass } : {},
            last_changed: new Date().toISOString(),
        };
    }

    const set = (domain, key, state) => {
        const entity = ENTITIES.find(e => e.domain === domain && e.key === key);
        const id = entityId(entity, release === '3.0.2' ? 'en' : language);
        if (states[id]) states[id].state = state;
    };

    set('sensor', 'status', status);
    set('sensor', 'timer', String(timer));
    set('sensor', 'mode', 'Mode 1');
    set('select', 'mode', 'Mode 1');
    set('sensor', 'battery_level', '80');
    set('binary_sensor', 'connection', 'on');
    if (pro) set('binary_sensor', 'over_pressure_active', 'off');
    // The Brushing Time sensor read a constant 0 on the V1 and is gone from
    // 3.0.3 on; the Wave Pro never reported the key either.
    if (release === '3.0.2' && !pro) set('sensor', 'brushing_time', '0');
    // Only the Wave Pro reports the duration back, so only there does the
    // sensor leave "unavailable" - it counts in seconds.
    if (pro && routineMinutes !== null) {
        set('sensor', 'brushing_duration', String(routineMinutes * 60));
    }
    // The number is settable on the Wave from 3.0.3 on. Neither handle reports
    // the value back, so it reads "unknown" until it has been set once.
    if (release === '3.0.3' || pro) {
        set('number', 'brushing_duration',
            routineMinutes === null ? 'unknown' : String(routineMinutes.toFixed(1)));
    }

    return {
        language,
        locale: { language },
        devices: { dev1: DEVICE },
        entities,
        states,
        // The tests disable the history recap, so this is never reached.
        callWS: async () => ({}),
    };
}

export { entityId };
