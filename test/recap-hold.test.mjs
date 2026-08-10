// How long a finished session stays on the card.
//
// The recap is held after brushing ends (`hold_duration`, default half an
// hour) and then disappears. Both edges are pure clock arithmetic, so they are
// driven here with Node's fake timers rather than by waiting - `Date.now()` is
// read from the global at call time, so faking it reaches the card whether it
// is loaded from src/ or from the bundle.
//
// What the card decided is read off `_getSectorData`, the same way the Oral-B
// replay does it: while a completed session is held, the card forces the
// sector to `success`; once the hold expires the recap is gone and the idle
// handle reports no sector at all.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadCard } from './helpers/replay.mjs';
import { laifenHass } from './helpers/laifen-integration.mjs';

const START = new Date('2026-08-10T07:30:00Z');
const MINUTE = 60_000;

/**
 * A card that has just finished a full two-minute session.
 *
 * Returns the element plus a `sector()` reader that renders and reports the
 * sector the card settled on.
 */
async function afterASession(config = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1',
        history_recap: false, ...config,
    });

    let seen = null;
    const base = Object.getPrototypeOf(el)._getSectorData;
    el._getSectorData = function (sector, ...rest) {
        seen = sector;
        return base.call(this, sector, ...rest);
    };

    const brushing = { model: 'wave', routineMinutes: 2, status: 'Running', timer: 130 };
    el.hass = laifenHass(brushing);
    el.render();
    // Handle switches off - the active -> inactive transition latches the recap.
    el.hass = laifenHass({ ...brushing, status: 'Idle', timer: 0 });
    el.render();

    return {
        el,
        sector: () => { seen = null; el.render(); return seen; },
    };
}

describe('the completed-session recap', () => {
    test('is shown right after the session', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { sector } = await afterASession();
        assert.equal(sector(), 'success');
    });

    test('survives most of the default half-hour hold', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { sector } = await afterASession();
        t.mock.timers.tick(29 * MINUTE);
        assert.equal(sector(), 'success');
    });

    test('is gone once the hold has expired', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { sector } = await afterASession();
        t.mock.timers.tick(31 * MINUTE);
        assert.equal(sector(), 'no_sector');
    });

    test('hold_duration: 0 keeps it until the next session', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { sector } = await afterASession({ hold_duration: 0 });
        t.mock.timers.tick(14 * 24 * 60 * MINUTE);
        assert.equal(sector(), 'success', 'no time limit means no expiry');
    });

    test('a configured hold_duration is honoured', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { sector } = await afterASession({ hold_duration: 4 });
        t.mock.timers.tick(3 * 60 * MINUTE);
        assert.equal(sector(), 'success', 'still inside the four-hour window');
        t.mock.timers.tick(2 * 60 * MINUTE);
        assert.equal(sector(), 'no_sector', 'and gone after it');
    });

    test('hold_completed: false suppresses it entirely', async (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { sector } = await afterASession({ hold_completed: false });
        assert.equal(sector(), 'no_sector');
    });
});
