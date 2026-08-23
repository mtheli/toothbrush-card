export const CONN_ICONS = {
    bluetooth: 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z',
    // Shown in place of the plain glyph while a session is running
    // (mdiBluetoothTransfer). The three connection states differ in weight
    // already, but a second cue that survives any theme is worth the one
    // extra path: weight says how present the connection is, shape says
    // whether anything is moving over it.
    bluetooth_transfer: 'M14.71,7.71L10.41,12L14.71,16.29L9,22H8V14.41L3.41,19L2,17.59L7.59,12L2,6.41L3.41,5L8,9.59V2H9L14.71,7.71M10,5.83V9.59L11.88,7.71L10,5.83M11.88,16.29L10,14.41V18.17L11.88,16.29M22,8H20V11H18V8H16L19,4L22,8M22,16L19,20L16,16H18V13H20V16H22Z',
    // And in place of it when there is no connection at all
    // (mdiBluetoothOff). Weight alone already told the three states apart, but
    // it needs a second icon to compare against and there is usually only one
    // on screen; shape stands on its own.
    bluetooth_off: 'M13,5.83L14.88,7.71L13.28,9.31L14.69,10.72L17.71,7.7L12,2H11V7.03L13,9.03M5.41,4L4,5.41L10.59,12L5,17.59L6.41,19L11,14.41V22H12L16.29,17.71L18.59,20L20,18.59M13,18.17V14.41L14.88,16.29',
    // The ESP bridge, in three states like Bluetooth beside it. The third one
    // is not a guess: philips_sonicare_ble only creates the bridge entity when
    // the transport actually is the bridge (binary_sensor.py), so a connected
    // handle means the bridge is carrying it.
    network: 'M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7Z',
    network_active: 'M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M12,14L16,10H13V6H11V10H8L12,14Z',
    network_off: 'M1.04,5.27L5,9.23V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H17.77L19.77,24L21.04,22.72L2.32,4L1.04,5.27M7,11.23L10.77,15H7V11.23M15,20A1,1 0 0,0 14,19H13V17.23L15.77,20H15M22,20V21.14L20.86,20H22M7,6.14L5.14,4.28C5.43,3.53 6.16,3 7,3H17A2,2 0 0,1 19,5V15C19,15.85 18.47,16.57 17.72,16.86L15.86,15H17V5H7V6.14Z',
    // Charging station (mdiPowerPlug). Shown next to the Bluetooth icon when
    // the handle is paired with one — a path indicator, never a fault: a
    // station that is merely idle looks exactly like a working one.
    charger: 'M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z',
};

export const MODE_ICONS = {
    // OralB modes
    "daily_clean": "mdi:repeat-once",
    "deep_clean": "mdi:water",
    // oralb_live spells two modes differently from the built-in oralb
    // integration: gentle_white has no counterpart there at all, and
    // tongue_clean is its name for tongue_cleaning.
    "gentle_white": "mdi:shimmer",
    "gum_care": "mdi:tooth-outline",
    "intense": "mdi:shape-circle-plus",
    "massage": "mdi:spa",
    "off": "mdi:power",
    "sensitive": "mdi:feather",
    "settings": "mdi:cog-outline",
    "smart_adapt": "mdi:auto-fix",
    "super_sensitive": "mdi:feather",
    "tongue_clean": "mdi:gate-and",
    "tongue_cleaning": "mdi:gate-and",
    "turbo": "mdi:car-turbocharger",
    "whiten": "mdi:shimmer",
    "whitening": "mdi:shimmer",
    // Sonicare modes
    "clean": "mdi:toothbrush-electric",
    "white_plus": "mdi:shimmer",
    "gum_health": "mdi:tooth-outline",
    "deep_clean_plus": "mdi:water",
    "tongue_care": "mdi:emoticon-tongue-outline",
    "default": "mdi:brush-variant"
};

// --- Oral-B display face (FF0A), latched at the end of a session ------------
// oralb_live mirrors the handle's own display as `sensor.*_smiley`: `off`,
// `standard` and `special_2`..`special_11`. Raw paths rather than `mdi:` names
// so @mdi/js stays out of the bundle, matching CONN_ICONS above.
//
// Only three values are decoded. The rest render a question mark plus their raw
// value, which is what turns every installed card into a reporter for issue #20
// — a face would have to pick a mouth, and every mouth is a verdict we cannot
// back yet.

// MDI has no face with star eyes (mdi:star-face is a star-SHAPED face), so
// special_10 is drawn here: the standard outline ring and happy mouth with the
// eyes replaced by two 5-point stars, cut fat enough to read at 34 px.
const SMILEY_STAR_EYES = 'M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20ZM12,18C14.33,18 16.3,16.54 17.11,14.5H6.89C7.69,16.54 9.67,18 12,18ZM8.50,6.00L9.50,7.92L11.64,8.28L10.12,9.83L10.44,11.97L8.50,11.00L6.56,11.97L6.88,9.83L5.36,8.28L7.50,7.92ZM15.50,6.00L16.50,7.92L18.64,8.28L17.12,9.83L17.44,11.97L15.50,11.00L13.56,11.97L13.88,9.83L12.36,8.28L14.50,7.92Z';

// mdi:medal — special_11 is "time AND pressure fulfilled", a standard met, not
// a rank won, so deliberately not a podium or trophy.
const SMILEY_MEDAL = 'M20,2H4V4L9.81,8.36C6.14,9.57 4.14,13.53 5.35,17.2C6.56,20.87 10.5,22.87 14.19,21.66C17.86,20.45 19.86,16.5 18.65,12.82C17.95,10.71 16.3,9.05 14.19,8.36L20,4V2M14.94,19.5L12,17.78L9.06,19.5L9.84,16.17L7.25,13.93L10.66,13.64L12,10.5L13.34,13.64L16.75,13.93L14.16,16.17L14.94,19.5Z';
// mdi:emoticon-happy-outline
const SMILEY_HAPPY = 'M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z';
// mdi:emoticon-neutral-outline — reserved, no value maps here yet
const SMILEY_NEUTRAL = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11M17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5M16,14V16H8V14H16Z';
// mdi:emoticon-sad-outline — reserved, no value maps here yet
const SMILEY_SAD = 'M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M12,14C13.75,14 15.29,14.72 16.19,15.81L14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,17.23L7.81,15.81C8.71,14.72 10.25,14 12,14Z';
// mdi:help-circle-outline — the undecoded marker
const SMILEY_UNKNOWN = 'M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z';

// Gold is deliberately absent: it belongs to the score chip, and a third accent
// clashes with a badge that is already green or amber. `perfect` and
// `excellent` share green and are told apart by shape, which reads at 34 px.
export const SMILEY_TIERS = {
    perfect:   { path: SMILEY_MEDAL,     color: 'green' },
    excellent: { path: SMILEY_STAR_EYES, color: 'green' },
    good:      { path: SMILEY_HAPPY,     color: 'green' },
    fair:      { path: SMILEY_NEUTRAL,   color: 'amber' },
    poor:      { path: SMILEY_SAD,       color: 'red'   },
};

// `standard` is the handle's own name for a face rather than a placeholder
// like special_N, so it is treated as decoded and never asks to be reported.
export const SMILEY_SENTIMENT = {
    // `standard` is the bottom of the scale, not the everyday face it was
    // taken for. Measured 2026-08 on both handles: the value appears in the
    // second a session ends, holds the ~30 s the display stays lit and then
    // sleeps to `off`, exactly as every other result face does - and between
    // sessions the reading is `off`, never this. Two sessions of ~25 s
    // produced it on an iO6 and an iO8 alike, each with a frowning handle
    // display. A capture from an earlier night shows why: the face climbs
    // with the brushing time (34 s -> 1, 70 s -> 2, 106 s -> 4, 136 s -> 5),
    // so where a session stops is which face it keeps.
    standard: 'poor',         // frown — a session barely begun (<~30 s)
    // 2–6 decoded 2026-08 from advertisement captures photographed against
    // the handle display, on an iO6 and an iO8 alike (issue #20): short and
    // paused runs settle on the two neutral variants, ~100 s on a half
    // smile, a completed two-minute run on the full smile, and a run pushed
    // past ~2:15 on the same star-eyed face the newest handles report as
    // special_10.
    special_2: 'fair',        // neutral face — an 81 s run
    special_3: 'fair',        // the same tier's second neutral variant
    special_4: 'good',        // half smile — 100–115 s
    special_5: 'good',        // full smile — a completed run
    special_6: 'excellent',   // star eyes — overtime runs, both generations
    special_10: 'excellent',  // star eyes, full smile — hipp0o, issue #20
    special_11: 'perfect',    // "everything regarding cleaning time and
                              //  pressure is fulfilled" — hipp0o, issue #20
    // special_7, 8 and 9 undecoded — never observed on any handle so far.
};

/**
 * The badge face for a smiley sensor state, or null when there is nothing to
 * show. Undecoded values carry `code` so the badge can print the raw value.
 */
export const smileyTier = (state) => {
    if (!state || state === 'off') return null;
    return SMILEY_TIERS[SMILEY_SENTIMENT[state]]
        || { path: SMILEY_UNKNOWN, color: 'muted', code: state };
};