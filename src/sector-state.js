// Which zone the card highlights, and which ones it shows as done.
//
// The second state machine that used to live inside render(). Three different
// devices want three different answers here, and the branch that runs decides
// what the four remembered values are even for:
//
//   * A handle whose integration decodes every sector itself. The reported
//     value is taken as-is and nothing has to be remembered.
//   * A handle that revisits sectors on purpose - Sonicare's White+ and Gum
//     Health walk the six zones and then return to two of them. The zone is
//     taken as-is here too, but a zone already finished has to stay finished
//     when the reading jumps backwards.
//   * Everything else, where the pre-2026.8 oralb_ble mapping had no entries
//     for sectors 5 and 6 and wrapped back to 4 instead. While brushing a
//     sector only moves forward, so a value that does not exceed the highest
//     one seen is read as the next one.
//
// Which of the three applies is passed in as two flags rather than decided
// here: this module knows nothing about integrations, only about behaviour.

/** The state a card starts with. */
export function initialSectorState() {
    return {
        highestSector: -1,
        lastRawIndex: -1,
        correctedIndex: -1,
        wasActive: false,
        visitedSectors: null,
    };
}

/** Forget what a session taught us, keeping the active flag as it is. */
export function resetCorrection(state) {
    return { ...state, highestSector: -1, lastRawIndex: -1, correctedIndex: -1 };
}

/**
 * The 0-based zone index a sector value names, or -1 for none.
 *
 * Values are 1-based by Oral-B convention ("sector 3"), and the time-based
 * fallback in the card produces the same shape on purpose.
 */
export function parseRawSectorIndex(sector) {
    const match = String(sector).match(/(\d+)/);
    if (!match) return -1;
    const index = parseInt(match[1]) - 1;
    return index >= 0 ? index : -1;
}

/**
 * True when a sector entity can express every sector the brush has.
 *
 * oralb_ble 1.1.1 (Home Assistant 2026.8) replaced the hand-built sector table
 * with a decoder for sectors 5/6, and the entity now offers `sector_1`…
 * `sector_7` as enum options. Older releases never listed anything above
 * `sector_4`, so `sector_5` among the options is a reliable marker that the
 * upstream fix is in place. Attributes are stripped while an entity is
 * unavailable, and the missing options then read as "not decoded" - which
 * leaves the workaround on, the safe half of that guess.
 */
export function decodesAllSectors(options) {
    return Array.isArray(options) && options.includes('sector_5');
}

/**
 * Advance the wrap-compensating correction by one reading.
 *
 * Returns the new state and the index to highlight. An inactive handle gets
 * the raw index back rather than a corrected one, and the correction never
 * runs past `maxIndex`.
 */
export function correctSectorIndex(prev, { rawIndex, active, maxIndex }) {
    let state = prev;
    // A session beginning starts from scratch rather than from the old peak.
    if (!prev.wasActive && active) {
        state = resetCorrection(state);
    }
    state = { ...state, wasActive: active };

    if (!active || rawIndex === -1) {
        return { state: resetCorrection(state), index: rawIndex };
    }

    // The same raw value again is the handle repeating itself, not progress -
    // without this the card would walk through the zones on its own.
    if (rawIndex === state.lastRawIndex) {
        return { state, index: state.correctedIndex };
    }

    state = { ...state, lastRawIndex: rawIndex };

    if (rawIndex > state.highestSector) {
        state = { ...state, highestSector: rawIndex, correctedIndex: rawIndex };
    } else {
        // The reading stalled or went backwards: that is the wrap, so move on.
        const corrected = Math.min(state.highestSector + 1, maxIndex);
        state = { ...state, highestSector: corrected, correctedIndex: corrected };
    }
    return { state, index: state.correctedIndex };
}

/** Count the distinct zones a session has touched. Cleared when it ends. */
export function trackVisitedSector(prev, { rawIndex, active }) {
    if (!active) {
        return { state: { ...prev, visitedSectors: null }, count: 0 };
    }
    const visited = new Set(prev.visitedSectors || []);
    if (rawIndex >= 0) visited.add(rawIndex);
    return { state: { ...prev, visitedSectors: visited }, count: visited.size };
}

/**
 * Resolve one reading into the zone to highlight and how many count as done.
 *
 * `doneCount` is null wherever progress is marked by index alone; only the
 * revisit path needs to say more than "everything before the active one".
 */
export function resolveSector(prev, {
    sector,
    active,
    zoneCount,
    duration,
    routineLength,
    allowsRevisits = false,
    sectorsAreUpstreamDecoded = false,
}) {
    const maxIndex = zoneCount - 1;
    const rawIndex = parseRawSectorIndex(sector);

    if (sector === 'success') {
        return { state: prev, index: -1, doneCount: null };
    }

    const clamped = rawIndex >= 0 ? Math.min(rawIndex, maxIndex) : -1;

    if (allowsRevisits) {
        // Time and observation combined, taking whichever is further along, so
        // that a revisit cannot un-finish a zone: after the initial sweep the
        // raw sector jumps back, but every zone has genuinely been brushed.
        const timeBasedDone = Math.min(
            zoneCount,
            Math.floor(zoneCount * duration / routineLength)
        );
        const visited = trackVisitedSector(prev, { rawIndex, active });
        return {
            state: visited.state,
            index: clamped,
            doneCount: Math.max(timeBasedDone, visited.count),
        };
    }

    if (sectorsAreUpstreamDecoded) {
        // Clear the workaround's latch so that falling back to it - the entity
        // going briefly unavailable - starts cleanly rather than mid-session.
        return {
            state: resetCorrection({ ...prev, wasActive: false }),
            index: clamped,
            doneCount: null,
        };
    }

    const corrected = correctSectorIndex(prev, { rawIndex, active, maxIndex });
    return { state: corrected.state, index: corrected.index, doneCount: null };
}
