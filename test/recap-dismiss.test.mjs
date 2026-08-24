// Dismissing a held recap, and remembering that it was dismissed.
//
// The × on the completion badge clears the recap and writes a marker to
// localStorage, so reopening the dashboard does not immediately rebuild the
// same session from frozen sensor values or recorder history. Only the marker
// is stored - the recap itself is always re-derived, which is what lets it
// work on a second browser or phone.
//
// This had no coverage at all, and it could not have had any: the DOM shim
// carried no localStorage, so every call threw and was swallowed by the card's
// own try/catch. The dismiss path was never entered, and nothing said so.
// `_holdDismissed` is one of the nine fields the session state machine is made
// of, so it needs to be pinned before that machine moves.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage, breakStorage } from './helpers/dom-shim.mjs';
import { loadCard } from './helpers/replay.mjs';
import { markup } from './helpers/markup.mjs';
import { laifenHass } from './helpers/laifen-integration.mjs';

const START = new Date('2026-08-11T06:00:00Z');
const KEY = 'toothbrush-card-hold-dev1';

/** A card that has just finished a full session, with its sector readable. */
async function afterASession(deviceId = 'dev1') {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: deviceId, history_recap: false,
    });

    let seen = null;
    const base = Object.getPrototypeOf(el)._getSectorData;
    el._getSectorData = function (sector, ...rest) {
        seen = sector;
        return base.call(this, sector, ...rest);
    };

    const feed = (running, timer) => {
        el.hass = laifenHass({
            model: 'wave', routineMinutes: 2,
            status: running ? 'Running' : 'Idle', timer,
        });
        el.render();
    };
    feed(true, 130);
    feed(false, 0);

    return { el, feed, sector: () => { seen = null; el.render(); return seen; } };
}

/**
 * A card that has only been configured - no session driven through it.
 *
 * Needed wherever the stored marker is the subject: running a session lifts
 * the dismissal on purpose, so a helper that brushes first would wipe exactly
 * what the test is about.
 */
async function freshCard(deviceId = 'dev1') {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({ type: 'custom:toothbrush-card', device_id: deviceId });
    return el;
}

describe('dismissing the recap', () => {
    test('takes it off the card', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, sector } = await afterASession();
        assert.equal(sector(), 'success', 'the recap is up');

        el._dismissHold();
        assert.equal(sector(), 'no_sector');
        assert.equal(el._completed, false);
        assert.equal(el._completedDuration, 0, 'and the session values are cleared with it');
    });

    test('writes a marker for that device', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el } = await afterASession();
        assert.equal(localStorage.getItem(KEY), null, 'nothing stored before');

        el._dismissHold();
        assert.deepEqual(JSON.parse(localStorage.getItem(KEY)), { dismissed: true });
    });

    test('is remembered by a card built fresh for the same device', async (t) => {
        // The case this exists for: reopening the dashboard must not rebuild
        // the session that was just dismissed.
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const first = await afterASession();
        first.el._dismissHold();

        assert.equal((await freshCard('dev1'))._holdDismissed, true,
            'adopted through setConfig');
    });

    test('is kept per device, not globally', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const first = await afterASession('dev1');
        first.el._dismissHold();

        assert.equal((await freshCard('dev2'))._holdDismissed, false,
            'the second brush has a recap of its own to show');
    });

    test('switching a card from one device to the other picks up each marker', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const first = await afterASession('dev1');
        first.el._dismissHold();

        const el = await freshCard('dev2');
        assert.equal(el._holdDismissed, false);
        el.setConfig({ type: 'custom:toothbrush-card', device_id: 'dev1' });
        assert.equal(el._holdDismissed, true, 're-read on every device change');
    });
});

describe('starting a new session', () => {
    test('lifts the dismissal and clears the marker', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, feed } = await afterASession();
        el._dismissHold();
        assert.ok(localStorage.getItem(KEY), 'stored while dismissed');

        feed(true, 5);
        assert.equal(el._holdDismissed, false);
        assert.equal(localStorage.getItem(KEY), null,
            'so the next finished session is shown again');
    });

    test('and that session gets its own recap', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, feed, sector } = await afterASession();
        el._dismissHold();

        for (const s of [130, 0]) feed(s > 0, s);
        assert.equal(sector(), 'success');
        assert.equal(el._completed, true);
    });
});

describe('what the dismissal blocks while it stands', () => {
    // An idle card with the recorder rebuild enabled - the default.
    async function idleCard() {
        const el = await freshCard('dev1');
        const calls = [];
        const hass = laifenHass({ model: 'wave', routineMinutes: 2, status: 'Idle', timer: 0 });
        hass.callWS = async (msg) => { calls.push(msg); return {}; };
        el.hass = hass;
        el.render();
        await new Promise(resolve => setImmediate(resolve));
        return { el, calls };
    }

    test('normally the recorder is asked once', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { calls } = await idleCard();
        assert.equal(calls.length, 1);
        assert.equal(calls[0].type, 'history/history_during_period');
    });

    test('but not while a dismissal stands', async (t) => {
        // Otherwise reopening the dashboard would fetch the very session the
        // user just waved away, and put it straight back on screen.
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        localStorage.setItem(KEY, JSON.stringify({ dismissed: true }));
        const { el, calls } = await idleCard();
        assert.equal(el._holdDismissed, true);
        assert.equal(calls.length, 0, 'no query at all');
    });
});

describe('when the browser refuses to store anything', () => {
    test('dismissing still works for the current view', async (t) => {
        // Private browsing, or site data blocked. Every call throws; the card
        // swallows it and carries on, it just cannot remember across a reload.
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, sector } = await afterASession();
        breakStorage();

        assert.doesNotThrow(() => el._dismissHold());
        assert.equal(sector(), 'no_sector', 'the recap is gone from this card');
        assert.equal(el._holdDismissed, true);
    });

    test('and a fresh card simply starts undismissed', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        breakStorage();
        const { el } = await afterASession();
        assert.equal(el._holdDismissed, false, 'nothing could be read, so nothing is assumed');
    });

    test('a corrupt stored value is treated as not dismissed', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        localStorage.setItem(KEY, 'not json at all');
        const { el } = await afterASession();
        assert.equal(el._holdDismissed, false);
    });
});

/**
 * A handle that leaves its timer standing at the routine length.
 *
 * Sonicare does exactly this: the session ends, the duration reading freezes
 * at what it reached and stays there until the next one. Laifen zeroes it, so
 * the helper above cannot show what that leftover does to the ring.
 */
function frozenHass(seconds = 160, routine = 160) {
    const entity = (id, translation_key) => ({
        entity_id: id, device_id: 'dev1', platform: 'philips_sonicare_ble', translation_key,
    });
    return {
        language: 'en',
        locale: { language: 'en' },
        devices: { dev1: { id: 'dev1', name: 'Prestige', manufacturer: 'Philips', config_entries: ['ce1'] } },
        entities: {
            'sensor.s_handle': entity('sensor.s_handle', 'handle_state'),
            'sensor.s_time': entity('sensor.s_time', 'time'),
            'sensor.s_routine': entity('sensor.s_routine', 'routine_length'),
        },
        states: {
            'sensor.s_handle': { state: 'idle', attributes: {}, last_changed: null },
            'sensor.s_time': {
                state: String(seconds), attributes: { device_class: 'duration' },
                last_changed: new Date().toISOString(),
            },
            'sensor.s_routine': { state: String(routine), attributes: {}, last_changed: null },
        },
        callWS: async () => ({}),
    };
}

async function frozenCard(config = {}) {
    const Card = await loadCard();
    const el = new Card();
    el.requestUpdate = () => {};
    el.setConfig({
        type: 'custom:toothbrush-card', device_id: 'dev1', history_recap: false, ...config,
    });
    // The zones as the ring draws them, not the sector value on the way in:
    // the sector says which zone is being brushed, while what is marked done
    // comes from the count beside it. Asserting the argument passed the fix
    // that left every zone green.
    let seen = null;
    let count = null;
    const base = Object.getPrototypeOf(el)._getSectorData;
    el._getSectorData = function (...args) {
        const map = base.call(this, ...args);
        seen = map;
        count = args[3];
        return map;
    };
    el.hass = frozenHass();
    el.render();
    const zones = () => { seen = null; el.render(); return seen; };
    const marked = () => Object.values(zones()).filter((z) => z.done).length;
    return {
        el,
        zones,
        marked,
        allMarked: () => marked() === Object.keys(zones()).length,
        // The count `_getSectorData` was handed. Once the sector is cleared,
        // a handle that allows revisits works this out from the running
        // duration - which is the reading still standing at the routine
        // length, and the reason clearing the sector alone changed nothing.
        // `null` would mean the test never reached that path at all.
        countPassed: () => { zones(); return count; },
        // What the timer prints. Read off the markup rather than off the
        // duration entity, because the point is exactly that the two are
        // allowed to disagree while the handle catches up.
        timer: () => markup(el.render())
            .match(/class="timer-display[\s\S]*?>\s*(\d+:\d{2})/)?.[1] ?? null,
    };
}

describe('the ring after the recap is gone', () => {
    // A reading left standing at the routine length reads as "all zones
    // done" on its own, with no recap involved. So taking the recap away has
    // to take the ring with it, or the badge disappears and a full green ring
    // stays behind - which is what happened on a Sonicare, twice: once on the
    // × and once when the hold window ran out.

    test('the × clears the ring, not just the badge', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { el, marked, allMarked, countPassed, timer } = await frozenCard();
        assert.ok(allMarked(), 'the finished session is up');
        assert.equal(timer(), '2:40');

        el._dismissHold();
        assert.equal(marked(), 0);
        assert.equal(timer(), '0:00', 'and the timer goes with it');
        assert.equal(countPassed(), 0,
            'the count was withheld, not merely absent - left to the duration '
            + 'it would have been four');
    });

    test('and so does the hold window running out', async (t) => {
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { marked, allMarked, timer } = await frozenCard({ hold_duration: 0.5 });
        assert.ok(allMarked());

        t.mock.timers.setTime(START.getTime() + 31 * 60_000);
        assert.equal(marked(), 0, 'nothing on screen says this session any more');
        assert.equal(timer(), '0:00');
    });

    test('and a card built fresh while the dismissal stands', async (t) => {
        // Reopening the dashboard must not put the ring back either. The
        // handle is still reporting the same frozen duration, and the marker
        // in storage is all that says the session is done with.
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const first = await frozenCard();
        first.el._dismissHold();

        const { marked } = await frozenCard();
        assert.equal(marked(), 0);
    });

    test('but switching the banner off leaves the ring alone', async (t) => {
        // hold_completed: false is about the banner. It says nothing about
        // the session, and the ring still shows a finished routine.
        resetStorage();
        t.mock.timers.enable({ apis: ['Date'], now: START });
        const { allMarked, timer } = await frozenCard({ hold_completed: false });
        assert.ok(allMarked());
        assert.equal(timer(), '2:40', 'and the timer still reads the session');
    });
});
