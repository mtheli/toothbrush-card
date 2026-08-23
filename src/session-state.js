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

// Readings that are not a face at all: the display asleep, and Home
// Assistant's own placeholders for a reading it does not have. Latched, the
// last two would put a "please report this face" badge on screen for what is
// plumbing, not data.
//
// `standard` is deliberately NOT here. It reads like a resting value and was
// taken for one, but it is the bottom rung of the scale - the frown a handle
// shows after a session barely begun, climbing from there with the brushing
// time. Measured on two handles: it appears in the second a session ends,
// holds the ~30 s the display stays lit and then sleeps to `off`, exactly as
// every other result face does.
//
// Known cost of reading it: a face sensor refreshed only over a connection
// can come to rest on it, and a resting frown latched onto a later session
// would condemn one nobody has finished. That exposure is not particular to
// this value - a resting `special_5` would praise the same session - so it is
// carried here rather than paid for with a rule for one face.
const NON_VERDICT_FACES = new Set([
    'off', 'unknown', 'unavailable',
]);

/**
 * Whether a face names a verdict on the session it follows.
 *
 * Exported because the live display is no longer the only place one arrives:
 * a handle's own record of a session can carry the face it showed at the end,
 * and the same readings mean nothing there for the same reasons.
 */
export function isVerdictFace(face) {
    return !!face && !NON_VERDICT_FACES.has(face);
}

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
        // The pacing of the routine this session is running, one entry per
        // step. Latched for the same reason as its length: a recap is read
        // after the fact, and by then the handle may be set to another mode
        // whose steps are neither as many nor as long.
        sessionStepSeconds: null,
        holdDismissed: false,
        stashedRecap: null,
        face: null,
        completedFace: null,
        completedScore: null,
        completedFromStash: false,
        // Seconds of the recapped session brushed too hard, where the record
        // says so. Only ever arrives with a recap rebuilt from such a record,
        // so it is null wherever one is established by another route - not
        // knowing is its own answer, and a different one from none.
        completedPressure: null,
        // The routine the recapped session was running, where the recap knows
        // it. The live reading is no substitute: by the time a recap is on
        // screen the handle may have been switched to another routine, or
        // report none at all.
        completedTarget: 0,
        completedStepSeconds: null,
        // Which route established the recap on screen: the latch watching a
        // session end (null), a rebuild from history, or the handle's own
        // record. Part of the latch state rather than the card's own, so it
        // is dropped and restored with the recap it describes.
        completedSource: null,
        // The session the handle had most recently filed when this one
        // started - the mark against which a record arriving later is judged
        // to belong to the session just watched. Handles number their
        // sessions in order, so a higher number is a later session and needs
        // no clock to say so. Null where the session was not seen starting.
        baselineSessionId: null,
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
 *   durationLastChanged - when the duration entity last changed, as reported
 *   displayFace       - the face the handle's display shows now, or null
 *   displayScore      - the score the handle reports now, or null
 *   faceWindow        - is the handle in a state that shows a session face
 *
 * Returns the new state plus two flags: `sessionStarted` for the caller to
 * forget a stored dismissal and drop the visited sectors, and `needsRecap`
 * to go and find out what the last session was. Where it looks is the
 * caller's business - the handle's own record and the recorder are two
 * answers to one question, and which of them is allowed is configuration,
 * not state.
 */
export function nextSessionState(prev, {
    active,
    duration,
    routineLength,
    now,
    holdCompleted,
    hasRoutineEntity = false,
    hasDurationEntity = false,
    durationLastChanged = null,
    displayFace = null,
    displayScore = null,
    faceWindow = false,
    stepSeconds = null,
}) {
    const state = { ...prev };
    let sessionStarted = false;
    let needsRecap = false;

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
                    steps: prev.completedStepSeconds,
                    source: prev.completedSource,
                }
                : null;
            state.peakDuration = 0;
            state.completed = false;
            state.completedAt = 0;
            state.holdDismissed = false;
            state.sessionRoutineLength = 0;
            state.sessionStepSeconds = null;
            state.face = null;
            state.completedFromStash = false;
        }
        state.peakDuration = Math.max(state.peakDuration, duration);
        if (routineLength > 0) {
            // Snapshot the routine governing THIS session: by the time it ends
            // the routine_length sensor may already read unavailable.
            state.sessionRoutineLength = routineLength;
        }
        if (Array.isArray(stepSeconds) && stepSeconds.length) {
            // Same snapshot, for how the routine paces itself. Kept beside
            // the length rather than derived from it, because the number of
            // steps is the mode's business and not the clock's.
            state.sessionStepSeconds = stepSeconds;
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
            // Watching says nothing about pressure, so it is unknown until a
            // record says otherwise - not zero, which would read as none.
            state.completedSource = null;
            state.completedPressure = null;
            state.completedTarget = state.sessionRoutineLength;
            state.completedStepSeconds = state.sessionStepSeconds;
        } else if (holdCompleted && state.stashedRecap) {
            state.completed = true;
            state.completedIsFull = state.stashedRecap.full;
            state.completedDuration = state.stashedRecap.duration;
            state.completedAt = state.stashedRecap.at;
            state.face = state.stashedRecap.face;
            // The restored session's own score, not the sensor's: the fumble
            // that was just discarded has already overwritten the sensor.
            state.completedScore = state.stashedRecap.score ?? null;
            state.completedPressure = state.stashedRecap.pressure ?? null;
            state.completedTarget = state.stashedRecap.target ?? 0;
            state.completedStepSeconds = state.stashedRecap.steps ?? null;
            state.completedSource = state.stashedRecap.source ?? null;
            state.completedFromStash = true;
        } else {
            state.completed = false;
            state.completedIsFull = false;
            state.completedDuration = 0;
            state.completedAt = 0;
            state.face = null;
            state.completedPressure = null;
            state.completedTarget = 0;
        state.completedStepSeconds = null;
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
            // Not watched: worked out from readings the handle left standing
            // after the session, which is a different thing to have seen it
            // happen and has to say so - this branch runs when the card was
            // closed while somebody brushed, or reloaded afterwards.
            //
            // Set only where the session is established here. This branch
            // runs on every render once a recap is up, and a session the
            // card did watch end would otherwise be relabelled a moment
            // later by the reading that outlived it.
            state.completedSource = 'reading';
        }
        state.completed = true;
        state.completedFromStash = false;
        state.completedPressure = null;
        state.completedTarget = 0;
        // Not cleared here: the mark belongs to the session that just ended,
        // and this is the moment a record of it is about to be waited for.
        // It is set when a session starts and dropped with the recap.
        state.completedIsFull =
            duration >= (routineLength || BRUSHING_DURATION) * COMPLETION_TOLERANCE;
    } else if (holdCompleted && !state.holdDismissed && !state.completed
            && hasDurationEntity) {
        // Issue #11: Oral-B wipes the reported values seconds after powering
        // off, and an aborted run can leave a frozen below-target one, so the
        // current state often proves nothing. The last session is rebuilt from
        // recorder history instead.
        //
        // Issue #18: deliberately no routine_length gate. The query resolves
        // the target from history and declines the recap itself if neither
        // source can name one, so an integration whose sensors go unavailable
        // on disconnect still gets its session back.
        needsRecap = true;
    }

    // The result face is not shown while the motor runs: the brush switches to
    // a summary state first, and that state is not `active`. So the latch keeps
    // adopting a face for as long as the caller holds the window open, and
    // completedFace fills in a beat after the recap appears rather than at the
    // transition. `off` is the display asleep, never a verdict — and `unknown`
    // and `unavailable` are Home Assistant placeholders, not values the handle
    // showed: latched, they would put a "please report this face" badge on
    // screen for what is plumbing, not data.
    //
    // `standard` is adopted like any other face. It is the bottom of the
    // scale, not the everyday face an earlier reading of this file assumed -
    // see the note beside NON_VERDICT_FACES, including what that costs.
    if (faceWindow && isVerdictFace(displayFace)) {
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
    return { state, sessionStarted, needsRecap };
}
