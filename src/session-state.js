// The completion latch, as a plain state transition.
//
// Neither integration keeps reporting a session once it is over: Oral-B
// freezes its last advertised values and then wipes them, Sonicare powers
// itself off. So a finished session has to be held by the card rather than
// read back from the handle, and issues #4, #5, #11 and #18 all landed here.
//
// This used to live inside render(), mutating nine fields as a side effect of
// drawing. Pulled out, it is a function of the previous state and what the
// device currently reports - which is what it always was, only now it can be
// tested by feeding it states instead of by replaying a session through a
// whole card.
//
// It stays pure on purpose. The two things it cannot do itself - forgetting a
// dismissal and asking the recorder - are reported back as flags for the
// caller to act on.

export const BRUSHING_DURATION = 120; // 2 minutes target

// Runs shorter than this are button fumbles, not brushing attempts - they
// neither become a recap nor replace one.
export const MIN_RECAP_SECONDS = 10;

// A session counts as finished slightly short of its target: a handle can
// power off a beat before the last duration sample lands exactly on it.
const COMPLETION_TOLERANCE = 0.9;

/** The state a card starts with, and what this function returns a new one of. */
export function initialSessionState() {
    return {
        peakDuration: 0,
        completed: false,
        completedDuration: 0,
        completedAt: 0,
        completedIsFull: false,
        wasActiveSession: false,
        sessionRoutineLength: 0,
        holdDismissed: false,
        stashedRecap: null,
        face: null,
        completedFace: null,
        completedScore: null,
        completedFromStash: false,
        // Seconds of the recapped session brushed too hard, where the record
        // says so. Only ever arrives with a recap rebuilt from such a record,
        // so it is cleared wherever one is established by another route.
        completedPressure: 0,
        // The routine the recapped session was running, where the recap knows
        // it. The live reading is no substitute: by the time a recap is on
        // screen the handle may have been switched to another routine, or
        // report none at all.
        completedTarget: 0,
        // Which route established the recap on screen: the latch watching a
        // session end (null), a rebuild from history, or the handle's own
        // record. Part of the latch state rather than the card's own, so it
        // is dropped and restored with the recap it describes.
        completedSource: null,
    };
}

/**
 * Advance the latch by one reading.
 *
 * `prev` is the state as of the last reading. The input describes what the
 * device says now:
 *
 *   active            - is the handle running
 *   duration          - elapsed seconds it reports
 *   routineLength     - the routine it is running, 0 if unknown
 *   now               - the current time in ms, passed in rather than read
 *   holdCompleted     - false disables the recap entirely (`hold_completed`)
 *   hasRoutineEntity  - does the device have a routine-length entity at all
 *   hasDurationEntity - likewise for elapsed time
 *   historyRecapEnabled - `history_recap` is not false
 *   durationLastChanged - when the duration entity last changed, as reported
 *   displayFace       - the face the handle's display shows now, or null
 *   displayScore      - the score the handle reports now, or null
 *   faceWindow        - is the handle in a state that shows a session face
 *
 * Returns the new state plus two flags: `sessionStarted` for the caller to
 * forget a stored dismissal and drop the visited sectors, and
 * `loadHistoryRecap` to go and ask the recorder.
 */
export function nextSessionState(prev, {
    active,
    duration,
    routineLength,
    now,
    holdCompleted,
    hasRoutineEntity = false,
    hasDurationEntity = false,
    historyRecapEnabled = true,
    durationLastChanged = null,
    displayFace = null,
    displayScore = null,
    faceWindow = false,
}) {
    const state = { ...prev };
    let sessionStarted = false;
    let loadHistoryRecap = false;

    if (active) {
        if (!prev.wasActiveSession) {
            // A new session began. Stash whatever recap is on screen: a real
            // session replaces it, a seconds-long button fumble puts it back.
            sessionStarted = true;
            state.stashedRecap = prev.completed
                ? {
                    duration: prev.completedDuration,
                    at: prev.completedAt,
                    full: prev.completedIsFull,
                    face: prev.completedFace,
                    score: prev.completedScore,
                    pressure: prev.completedPressure,
                    target: prev.completedTarget,
                    source: prev.completedSource,
                }
                : null;
            state.peakDuration = 0;
            state.completed = false;
            state.completedAt = 0;
            state.holdDismissed = false;
            state.sessionRoutineLength = 0;
            state.face = null;
            state.completedFromStash = false;
        }
        state.peakDuration = Math.max(state.peakDuration, duration);
        if (routineLength > 0) {
            // Snapshot the routine governing THIS session: by the time it ends
            // the routine_length sensor may already read unavailable.
            state.sessionRoutineLength = routineLength;
        }
    } else if (prev.wasActiveSession) {
        // The session just ended. Full and aborted runs both get a recap,
        // worded differently; a fumble below the floor restores the stash.
        const endTarget = (state.sessionRoutineLength || BRUSHING_DURATION) * COMPLETION_TOLERANCE;
        if (holdCompleted && state.peakDuration >= MIN_RECAP_SECONDS) {
            state.completed = true;
            state.completedIsFull = state.peakDuration >= endTarget;
            state.completedDuration = state.peakDuration;
            state.completedAt = now;
            state.completedFromStash = false;
            // This session was watched, not read: whatever the last recap
            // knew about the routine and the pressure was the last one's.
            state.completedSource = null;
            state.completedPressure = 0;
            state.completedTarget = state.sessionRoutineLength;
        } else if (holdCompleted && state.stashedRecap) {
            state.completed = true;
            state.completedIsFull = state.stashedRecap.full;
            state.completedDuration = state.stashedRecap.duration;
            state.completedAt = state.stashedRecap.at;
            state.face = state.stashedRecap.face;
            // The restored session's own score, not the sensor's: the fumble
            // that was just discarded has already overwritten the sensor.
            state.completedScore = state.stashedRecap.score ?? null;
            state.completedPressure = state.stashedRecap.pressure ?? 0;
            state.completedTarget = state.stashedRecap.target ?? 0;
            state.completedSource = state.stashedRecap.source ?? null;
            state.completedFromStash = true;
        } else {
            state.completed = false;
            state.completedIsFull = false;
            state.completedDuration = 0;
            state.completedAt = 0;
            state.face = null;
            state.completedPressure = 0;
            state.completedTarget = 0;
            state.completedSource = null;
            state.completedFromStash = false;
        }
        state.peakDuration = 0;
        state.stashedRecap = null;
    } else if (holdCompleted && !state.holdDismissed
            && (!hasRoutineEntity || routineLength > 0)
            && duration >= MIN_RECAP_SECONDS) {
        // Issue #5: derive the recap from the current state alone. The frozen
        // post-session values still describe the last session even if the card
        // never saw it end - dashboard closed while brushing, or reloaded
        // afterwards. Skipped while an existing routine_length sensor is
        // unreadable, so an aborted long routine cannot slip past the shorter
        // default target.
        //
        // Issue #11: a reading that differs from the adopted duration is a
        // newer session, or a late tail sample of one - the timer keeps ticking
        // for a few seconds after the end - so its timestamp and value are
        // adopted, downwards too.
        if (!state.completed || duration !== state.completedDuration) {
            state.completedAt = Date.parse(durationLastChanged) || now;
            state.completedDuration = duration;
        }
        state.completed = true;
        state.completedFromStash = false;
        // Adopted from the live reading, whatever established it before.
        state.completedSource = null;
        state.completedPressure = 0;
        state.completedTarget = 0;
        state.completedIsFull =
            duration >= (routineLength || BRUSHING_DURATION) * COMPLETION_TOLERANCE;
    } else if (holdCompleted && !state.holdDismissed && !state.completed
            && historyRecapEnabled && hasDurationEntity) {
        // Issue #11: Oral-B wipes the reported values seconds after powering
        // off, and an aborted run can leave a frozen below-target one, so the
        // current state often proves nothing. The last session is rebuilt from
        // recorder history instead.
        //
        // Issue #18: deliberately no routine_length gate. The query resolves
        // the target from history and declines the recap itself if neither
        // source can name one, so an integration whose sensors go unavailable
        // on disconnect still gets its session back.
        loadHistoryRecap = true;
    }

    // The result face is not shown while the motor runs: the brush switches to
    // a summary state first, and that state is not `active`. So the latch keeps
    // adopting a face for as long as the caller holds the window open, and
    // completedFace fills in a beat after the recap appears rather than at the
    // transition. `off` is the display asleep, never a verdict — and `unknown`
    // and `unavailable` are Home Assistant placeholders, not values the handle
    // showed: latched, they would put a "please report this face" badge on
    // screen for what is plumbing, not data.
    if (faceWindow && displayFace && displayFace !== 'off'
            && displayFace !== 'unknown' && displayFace !== 'unavailable') {
        state.face = displayFace;
    }
    state.completedFace = state.completed ? state.face : null;

    // The score arrives with the switch-off itself rather than after a summary
    // state, so it needs no window of its own - but it can still land a render
    // late. Adopting it for as long as the recap is held covers that, and
    // cannot stray into the next session: starting one clears the recap first.
    // Xiaomi is the only integration that reports one, and only at the end of
    // a session; between sessions the sensor keeps the last value, which is
    // exactly what makes it safe to read here. Except for a recap restored
    // from the stash: the discarded fumble has already written its own score
    // to the sensor, so the restored session keeps the score it was stashed
    // with instead.
    if (state.completed && !active && !state.completedFromStash
            && displayScore !== null && displayScore !== '') {
        state.completedScore = displayScore;
    } else if (!state.completed) {
        state.completedScore = null;
    }

    state.wasActiveSession = active;
    return { state, sessionStarted, loadHistoryRecap };
}
