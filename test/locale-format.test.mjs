// Writing times the way Home Assistant was asked to write them.
//
// The clock is a profile setting, and it is not the one the language
// implies - somebody can read a German dashboard and still want half past
// eight written as 8:30 PM. The card used to format by language alone, so
// for everyone who had changed that setting it wrote the other clock.
//
// The rule lives in src/locale.js and is exercised here directly; the last
// test follows it through the card, because a helper nothing calls fixes
// nothing.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';
import { useAmPm, formatDateTime } from '../src/locale.js';

// Local components on purpose: the assertions are about which clock was
// used, and a UTC instant would drag the machine's time zone into them.
const MORNING = new Date(2026, 7, 16, 8, 55);

describe('which clock the profile asks for', () => {
    test('the two explicit choices are obeyed whatever the language', () => {
        // '12' and '24' are what the profile's own two options become. They
        // override the language: this is the setting the language got wrong.
        assert.equal(useAmPm({ language: 'de', time_format: '12' }), true);
        assert.equal(useAmPm({ language: 'en', time_format: '24' }), false);
    });

    test('"language" defers to the chosen language', () => {
        assert.equal(useAmPm({ language: 'de', time_format: 'language' }), false);
        assert.equal(useAmPm({ language: 'en-US', time_format: 'language' }), true);
    });

    test('"system" and a missing setting answer without throwing', () => {
        // 'system' means the browser's own locale, which the test runner
        // decides; that it is answered at all is what matters. A locale
        // without the key is every hass built before this mattered.
        assert.equal(typeof useAmPm({ language: 'en', time_format: 'system' }), 'boolean');
        assert.equal(useAmPm({ language: 'de' }), false, 'falls back to the language');
        assert.equal(typeof useAmPm(undefined), 'boolean', 'and survives no locale at all');
    });
});

describe('the timestamp behind the done badge', () => {
    test('a twelve-hour profile gets a twelve-hour time', () => {
        // Asserting on the hour rather than on AM/PM: the designators differ
        // per language and per ICU version, the hour does not.
        const text = formatDateTime(
            { locale: { language: 'de', time_format: '12' } }, MORNING.getTime());
        assert.match(text, /\b8:55\b/);
        assert.doesNotMatch(text, /08:55/);
    });

    test('a twenty-four-hour profile keeps the leading zero', () => {
        const text = formatDateTime(
            { locale: { language: 'en', time_format: '24' } }, MORNING.getTime());
        assert.match(text, /08:55/);
        assert.doesNotMatch(text, /AM|PM/i);
    });

    test('the date is still written in the profile language', () => {
        const german = formatDateTime(
            { locale: { language: 'de', time_format: '24' } }, MORNING.getTime());
        const english = formatDateTime(
            { locale: { language: 'en-GB', time_format: '24' } }, MORNING.getTime());
        assert.match(german, /2026/);
        assert.notEqual(german, english, 'two languages, two spellings');
    });
});

describe('the card using it', () => {
    /** An idle handle whose session ended at a known moment. */
    async function cardWithRecap(locale) {
        const Card = await loadCard();
        const el = new Card();
        el.requestUpdate = () => {};
        el.setConfig({
            type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false,
        });

        const entity = (id, translation_key) => ({
            entity_id: id, device_id: 'dev1', platform: 'oralb_live', translation_key,
        });
        const hass = (status, duration) => ({
            language: locale.language,
            locale,
            devices: { dev1: { id: 'dev1', name: 'Oral-B iO', manufacturer: 'Oral-B', config_entries: ['ce1'] } },
            entities: {
                'sensor.io_toothbrush_state': entity('sensor.io_toothbrush_state', 'toothbrush_state'),
                'sensor.io_brushing_time': entity('sensor.io_brushing_time', 'brushing_time'),
            },
            states: {
                'sensor.io_toothbrush_state': { state: status, attributes: {}, last_changed: null },
                'sensor.io_brushing_time': { state: duration, attributes: {}, last_changed: null },
            },
            callWS: async () => ({}),
        });

        // Brush, then stop: that is how the recap latches. The latch stamps
        // "now", so the clock is frozen at the hour the assertions expect -
        // and the recap is still inside its hold when it is read back.
        el.hass = hass('running', '130');
        el.render();
        el.hass = hass('idle', '0');
        el.render();
        assert.equal(el._completed, true, 'a session to hang the timestamp on');
        assert.equal(el._completedAt, MORNING.getTime());
        return el;
    }

    test('the hover title follows the profile, not the language', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: MORNING });
        const twelve = markup((await cardWithRecap({ language: 'de', time_format: '12' })).render());
        const twentyFour = markup((await cardWithRecap({ language: 'de', time_format: '24' })).render());
        assert.match(twelve, /title="[^"]*\b8:55\b/);
        assert.match(twentyFour, /title="[^"]*08:55/);
    });
});
