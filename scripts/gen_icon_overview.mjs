// Generates docs/icon-overview.html: every state icon the card can show,
// with its trigger condition, MDI name and colour value.
//
// The state conditions, icon names and palette below mirror the logic in
// src/toothbrush-card.js (_getBatteryIcon, _getBatteryChipColor,
// _getPressureClass, _intensityFraction, MODE_ICONS, score tiers, headSvg)
// and must be kept in sync when that logic changes.
//
// Usage:  node scripts/gen_icon_overview.mjs
// PNG:    chromium --headless --screenshot=docs/icon-overview.png \
//           --window-size=1120,4400 --hide-scrollbars docs/icon-overview.html
//         The height has to cover the whole page - Chrome captures exactly the
//         window - so it grows with the reference. See docs/ICONS.md.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
    mdiBatteryUnknown, mdiBatteryAlertVariantOutline,
    mdiBattery10, mdiBattery20, mdiBattery30, mdiBattery40, mdiBattery50,
    mdiBattery60, mdiBattery70, mdiBattery80, mdiBattery90, mdiBattery,
    mdiBatteryCharging, mdiStarOutline, mdiStarHalfFull, mdiStar, mdiRepeatOnce,
    mdiWater, mdiToothOutline, mdiShapeCirclePlus, mdiSpa, mdiPower,
    mdiFeather, mdiCogOutline, mdiAutoFix, mdiGateAnd, mdiCarTurbocharger, mdiShimmer,
    mdiToothbrushElectric, mdiEmoticonTongueOutline, mdiBrushVariant,
    mdiToothbrush,
} from '@mdi/js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')).version;
const generated = new Date().toISOString().slice(0, 10);
const iconsJs = readFileSync(join(repoRoot, 'src/icons.js'), 'utf8');
const conn = {};
for (const key of ['bluetooth', 'bluetooth_transfer', 'bluetooth_off', 'network', 'network_active', 'network_off', 'charger']) {
    conn[key] = iconsJs.match(new RegExp(`${key}: '([^']+)'`))[1];
}
// Smiley paths are card-own constants (raw paths, not mdi: names) — read them
// from the source so this stays one definition, like CONN_ICONS above.
const smiley = {};
for (const key of ['SMILEY_STAR_EYES', 'SMILEY_MEDAL', 'SMILEY_HAPPY',
                   'SMILEY_NEUTRAL', 'SMILEY_SAD', 'SMILEY_UNKNOWN']) {
    smiley[key] = iconsJs.match(new RegExp(`const ${key} = '([^']+)'`))[1];
}

// Card palette (chip colour classes)
const C = {
    green: '#16a34a', amber: '#d97706', red: '#dc2626', gold: '#c47f16',
    blue: '#2563eb', muted: '#9ca3af',
    intLow: '#0891b2', intMed: '#7c3aed', intHigh: '#db2777',
    primary: '#3b82f6', btActive: '#0082fc',
};

const svg = (path, color, opacity = 1, size = 28) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="opacity:${opacity}"><path fill="${color}" d="${path}"/></svg>`;

const cell = (iconHtml, state, name, hex) => `
    <div class="cell">
      <div class="ic">${iconHtml}</div>
      <div class="st">${state}</div>
      <div class="nm">${name}</div>
      <div class="hx"><span class="sw" style="background:${hex.split(' ')[0]}"></span>${hex}</div>
    </div>`;

// `who` is the list of integrations a section applies to, rendered as pills
// beside the heading rather than buried in the note: which handles a reading
// exists on is the first thing someone scanning this page wants to know.
// A qualifier after " · " is set apart, so the pill itself stays the bare
// integration name and the list still reads as a set.
const pill = (label) => {
    const [name, qualifier] = label.split(' · ');
    return `<span class="pill">${name}${qualifier ? `<i>${qualifier}</i>` : ''}</span>`;
};

const section = (title, who, note, cells) => `
  <div class="section">
    <div class="head">
      <h3>${title}</h3>
      ${who ? `<div class="pills">${who.map(pill).join('')}</div>` : ''}
    </div>
    ${note ? `<p class="note">${note}</p>` : ''}
    <div class="grid">${cells.join('')}</div>
  </div>`;

// Sections are grouped by *where on the card* the icon appears, because that is
// the question someone arrives with: they have seen something on their card and
// want to know what it means. Grouping by reading instead would scatter the
// four header icons across the page and leave the badge looking like a chip.
const group = (title, blurb, sections) => `
  <section class="group">
    <div class="ghead">
      <h2>${title}</h2>
      <p>${blurb}</p>
    </div>
    ${sections.join('\n')}
  </section>`;

const header = [];
const chips = [];
const badge = [];
const other = [];

// Brush-head glyph: capsule with quarter-step fill, as drawn by headSvg()
// `tag` keeps the clip-path id unique where the same step/colour pair is drawn
// twice - the wear scale and the countdown share several of them, and two
// elements answering to one id is invalid markup even where it happens to
// render.
const headSvg = (steps, color, size = 28, tag = '') => {
    const clipY = 30 - steps * 7.5;
    const cap = 'M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z';
    const id = `hf${steps}${color.slice(1)}${tag}`;
    return `<svg width="${Math.round(size * 0.8)}" height="${size}" viewBox="0 0 24 30">
      <defs><clipPath id="${id}"><rect x="0" y="${clipY}" width="24" height="${30 - clipY}"/></clipPath></defs>
      <path d="${cap}" fill="${color}" opacity=".8" clip-path="url(#${id})"/>
      <path d="${cap}" fill="none" stroke="#888" stroke-width="2"/>
      <g stroke="#888" stroke-width="1.7"><line x1="10.5" y1="4" x2="3" y2="4"/><line x1="10.5" y1="8" x2="2.5" y2="8"/><line x1="10.5" y1="12" x2="3" y2="12"/><line x1="10.5" y1="16" x2="4.5" y2="16"/></g>
    </svg>`;
};

// Pressure bars as drawn in the chip (4 bars, heights 5/9/13/18)
// The intensity dial, mirroring .intensity-dial in the card's stylesheet: a
// 240° arc of radius 8.5 around (12, 13), the needle carrying the value and
// the arc behind it held back to 30 % so the two read as instrument and
// reading rather than as one stroke.
const ARC = 'M4.64 17.25 A8.5 8.5 0 1 1 19.36 17.25';
const intensityDial = (fraction, color, size = 28) => {
    const radians = (210 - 240 * fraction) * Math.PI / 180;
    const x = (12 + 5.2 * Math.cos(radians)).toFixed(2);
    const y = (13 - 5.2 * Math.sin(radians)).toFixed(2);
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
        <path d="${ARC}" fill="none" stroke="#e5e7eb" stroke-width="2.8" stroke-linecap="round" pathLength="100"/>
        <path d="${ARC}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round"
              opacity="0.55" pathLength="100" stroke-dasharray="${Math.round(fraction * 100)} 100"/>
        <line x1="12" y1="13" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="12" cy="13" r="1.5" fill="${color}"/>
    </svg>`;
};

const pressureBars = (active, color) => {
    const h = [5, 9, 13, 18];
    return `<svg width="30" height="22" viewBox="0 0 30 22">${h.map((hh, i) =>
        `<rect x="${i * 7.5}" y="${20 - hh}" width="5" height="${hh}" rx="1.5" fill="${
            (active === 'all' || i < active) ? color : '#e5e7eb'}"/>`).join('')}</svg>`;
};

header.push(section('Bluetooth', ['all integrations'], 'Card-own SVG paths (CONN_ICONS in icons.js), 18px. Three states, told apart by weight and by shape: a connection carrying something reads at full strength, one that is merely established is quieter, a broken one fades out. Colour alone could not do it - the active tone and the theme primary can be the same blue.', [
    cell(svg(conn.bluetooth, C.primary, 0.55), 'connected, idle', 'bluetooth', 'var(--primary-color) op.0.55'),
    cell(svg(conn.bluetooth_transfer, C.btActive), 'session running', 'bluetooth_transfer', '#0082fc op.1'),
    cell(svg(conn.bluetooth_off, C.muted, 0.3), 'no connection', 'bluetooth_off', '#9ca3af op.0.3'),
]));

header.push(section('ESP bridge', ['philips_sonicare_ble'], 'Shown only where the handle is reached through an ESP bridge - the integration creates the entity for no other transport, which is what makes the third state honest: if the bridge is there at all, a running session is data crossing it. Same weight and shape treatment as Bluetooth beside it.', [
    cell(svg(conn.network, C.primary, 0.55), 'bridge online, idle', 'network', 'var(--primary-color) op.0.55'),
    cell(svg(conn.network_active, C.btActive), 'carrying live data', 'network_active', '#0082fc op.1'),
    cell(svg(conn.network_off, C.muted, 0.3), 'bridge offline', 'network_off', '#9ca3af op.0.3'),
]));

header.push(section('Charger', ['oralb_live'], 'Shown only when the handle is paired with a charging station (charger_address on the main entity). Full strength while the data actually arrives through it (data_source = charger_bridge), quieter otherwise — an idle station is the normal state between sessions, not a fault.', [
    cell(svg(conn.charger, C.btActive), 'data via charger', 'card-own SVG (CONN_ICONS.charger)', '#0082fc op.1'),
    cell(svg(conn.charger, C.primary, 0.55), 'charger paired, idle', 'card-own SVG (CONN_ICONS.charger)', 'var(--primary-color) op.0.55'),
]));

header.push(section('Device menu', ['all integrations'], 'Opens the Home Assistant device page. Card-own dots rather than an MDI glyph, so it matches the other header icons in weight.', [
    cell(`<svg width="28" height="28" viewBox="0 0 24 24" style="opacity:.5"><g fill="#6b7280"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></g></svg>`, 'more info (⋮)', 'card-own dots', 'var(--secondary-text-color) op.0.5'),
]));

const batLevels = [
    [mdiBatteryUnknown, 'unavailable', 'battery-unknown', C.muted, '#9ca3af (muted)'],
    [mdiBatteryAlertVariantOutline, '≤ 5 %', 'battery-alert-variant-outline', C.red, '#dc2626'],
    [mdiBattery10, '6–15 %', 'battery-10', C.red, '#dc2626'],
    [mdiBattery20, '16–20 %', 'battery-20', C.amber, '#d97706'],
    [mdiBattery30, '21–30 %', 'battery-30', C.amber, '#d97706'],
    [mdiBattery40, '31–40 %', 'battery-40', C.green, '#16a34a'],
    [mdiBattery50, '41–50 %', 'battery-50', C.green, '#16a34a'],
    [mdiBattery60, '51–60 %', 'battery-60', C.green, '#16a34a'],
    [mdiBattery70, '61–70 %', 'battery-70', C.green, '#16a34a'],
    [mdiBattery80, '71–80 %', 'battery-80', C.green, '#16a34a'],
    [mdiBattery90, '81–90 %', 'battery-90', C.green, '#16a34a'],
    [mdiBattery, '91–100 %', 'battery', C.green, '#16a34a'],
    [mdiBatteryCharging, 'charging (any level)', 'battery-charging', C.green, 'colour follows level'],
];

chips.push(section('Battery', ['all integrations'], 'Icon step: ceil(level/10)·10 (_getBatteryIcon) · colour: ≤15 red, ≤30 amber, otherwise green (_getBatteryChipColor).', batLevels.map(([p, s, n, c, hx]) => cell(svg(p, c), s, `mdi:${n}`, hx))));

chips.push(section('Pressure', ['oralb', 'oralb_live', 'philips_sonicare_ble', 'laifen_ble · Wave Pro'], 'A drawn staircase rather than an icon, so the level is visible without reading the value. Chip and corner show the same bars. Traffic-light palette: pressing too hard is a warning, unlike intensity.', [
    cell(pressureBars(1, C.amber), 'low', 'bars 1/4', '#d97706'),
    cell(pressureBars(2, C.green), 'normal / medium', 'bars 2/4', '#16a34a'),
    cell(pressureBars('all', C.red), 'high', 'bars 4/4', '#dc2626'),
]));

chips.push(section('Intensity', ['philips_sonicare_ble', 'laifen_ble'], 'A drawn dial rather than an icon: a Laifen handle reports a level of 1-10 (11-20 in the high-frequency mode), and three speedometer variants could express almost none of it. Chip and corner show the same dial, only at different sizes. Deliberately NOT the traffic-light palette — intensity is a chosen setting, a high level must never read as a warning.', [
    cell(intensityDial(0.08, C.intLow), 'strength 1 of 10', 'drawn arc + needle', '#0891b2'),
    cell(intensityDial(0.45, C.intMed), 'strength 5 of 10', 'drawn arc + needle', '#7c3aed'),
    cell(intensityDial(0.72, C.intMed), 'strength 8 of 10', 'drawn arc + needle', '#7c3aed'),
    cell(intensityDial(1, C.intHigh), 'strength 10 of 10', 'drawn arc + needle', '#db2777'),
]));

const modes = [
    ['daily_clean', mdiRepeatOnce, 'repeat-once'],
    ['deep_clean / deep_clean_plus', mdiWater, 'water'],
    ['gum_care / gum_health', mdiToothOutline, 'tooth-outline'],
    ['intense', mdiShapeCirclePlus, 'shape-circle-plus'],
    ['massage', mdiSpa, 'spa'],
    ['off', mdiPower, 'power'],
    ['sensitive / super_sensitive', mdiFeather, 'feather'],
    ['settings', mdiCogOutline, 'cog-outline'],
    ['smart_adapt', mdiAutoFix, 'auto-fix'],
    ['tongue_clean(ing)', mdiGateAnd, 'gate-and'],
    ['turbo', mdiCarTurbocharger, 'car-turbocharger'],
    ['whiten(ing) / gentle_white / white_plus', mdiShimmer, 'shimmer'],
    ['clean', mdiToothbrushElectric, 'toothbrush-electric'],
    ['tongue_care', mdiEmoticonTongueOutline, 'emoticon-tongue-outline'],
    ['unknown mode', mdiBrushVariant, 'brush-variant (default)'],
];
chips.push(section('Mode', ['oralb', 'oralb_live', 'philips_sonicare_ble · settable', 'laifen_ble · settable'], 'Settable on the latter two. All modes share one blue; only "unavailable" is muted.',
    modes.map(([s, p, n]) => cell(svg(p, C.blue), s, `mdi:${n}`, '#2563eb'))
        .concat([cell(svg(mdiBrushVariant, C.muted), 'unavailable', 'mdi:brush-variant', '#9ca3af (muted)')])));

chips.push(section('Score', ['xiaomi_ble'], 'Star step + traffic-light colour; the value text takes the same colour. Non-numeric scores keep the full gold star. The same star also fills the verdict slot on the done badge - Xiaomi reports a score only when the handle switches off, so it describes the session that just ended. It shares that slot with the Oral-B display face and the verdict the card forms itself, which the three can do because no handle reports more than one.', [
    cell(svg(mdiStarOutline, C.red), '&lt; 60', 'mdi:star-outline', '#dc2626'),
    cell(svg(mdiStarHalfFull, C.amber), '60–84', 'mdi:star-half-full', '#d97706'),
    cell(svg(mdiStar, C.gold), '≥ 85', 'mdi:star', '#c47f16'),
    cell(svg(mdiStar, C.gold), 'non-numeric', 'mdi:star', '#c47f16'),
]));

chips.push(section('Brush head', ['philips_sonicare_ble · sub-device', 'xiaomi_ble · % left', 'oralb_live · days left'], 'Card-own glyph. Fill steps in quarters (by % remaining); colour follows wear (_getBrushheadColor): &gt;40 green, 21–40 amber, ≤20 red → 6 visible states. The value text takes the same colour (like battery).', [
    cell(headSvg(4, C.green), '100–76 %', '4/4 segments', '#16a34a'),
    cell(headSvg(3, C.green), '75–51 %', '3/4 segments', '#16a34a'),
    cell(headSvg(2, C.green), '50–41 %', '2/4 segments', '#16a34a'),
    cell(headSvg(2, C.amber), '40–26 %', '2/4 segments', '#d97706'),
    cell(headSvg(1, C.amber), '25–21 %', '1/4 segments', '#d97706'),
    cell(headSvg(1, C.red), '20–0 %', '1/4 segments', '#dc2626'),
]));

// The same slot, filled by a countdown instead of a wear reading. Oral-B
// reports what is left and never the total, so there is no percentage behind
// the fill height: the three tiers are the scale, said once as colour and once
// as height. Never 4/4, which would read as a fresh head, and never empty,
// which would read as a spent one.
chips.push(section('Brush head · countdown', ['oralb_live · days left'], 'Same glyph, different scale: the handle counts a head down in days and never reports a lifetime total, so the fill height is the tier rather than a proportion. Thresholds are on the remainder itself — &gt;14 d green, 14–3 d amber, &lt;3 d red. The chip label says "Head · days" so the two shapes cannot be confused, and the value carries the unit.', [
    cell(headSvg(3, C.green, 28, 'd'), 'more than 14 d', '3/4 segments', '#16a34a'),
    cell(headSvg(2, C.amber, 28, 'd'), '14–3 d', '2/4 segments', '#d97706'),
    cell(headSvg(1, C.red, 28, 'd'), 'under 3 d', '1/4 segments', '#dc2626'),
]));

chips.push(section('Head time', ['oralb_live · hours left'], 'The second Oral-B counter, placeable in its own slot: brushing hours left on the head. Same glyph and the same tier-as-height rule as the day counter, with its own thresholds — &gt;2 h green, 2–0.5 h amber, &lt;0.5 h red. Shown with one decimal below 10 h, whole hours above. Both counters are hidden while the handle reports refill tracking as off, because a number that never moves is worse than no chip.', [
    cell(headSvg(3, C.green, 28, 'h'), 'more than 2 h', '3/4 segments', '#16a34a'),
    cell(headSvg(2, C.amber, 28, 'h'), '2–0.5 h', '2/4 segments', '#d97706'),
    cell(headSvg(1, C.red, 28, 'h'), 'under 0.5 h', '1/4 segments', '#dc2626'),
]));

const letterGlyph = (letter) =>
    `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:1px">${svg(mdiToothbrush, '#212121', 1, 22)}<span style="font-size:9px;font-weight:800;line-height:1;color:#212121">${letter}</span></span>`;
chips.push(section('Head type', ['philips_sonicare_ble'], 'Neutral, no state colours: the type is information, not a warning. Wide layout: mdi:toothbrush + short family name. Compact icon-only layout: the family letter (the A in "A3") is tucked under the icon. Name and letter come from the type sensor’s family_name/family_letter attributes (single source in the integration; C/W/G/A/S official, T/N stand-ins for TongueCare+ and non-RFID). Without the attributes the full state text is shown, wrapped/clamped to two lines, with a plain icon. Hidden while no head is attached.', [
    cell(svg(mdiToothbrush, '#212121'), 'any type (wide)', 'mdi:toothbrush', '#212121 (theme text)'),
    cell(letterGlyph('C'), 'Clean (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(letterGlyph('W'), 'White (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(letterGlyph('G'), 'Gums (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(letterGlyph('T'), 'Tongue (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(letterGlyph('A'), 'All-in-One (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(letterGlyph('S'), 'Sensitive (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(letterGlyph('N'), 'Non-RFID (compact)', 'family_letter attr', '#212121 (theme text)'),
    cell(svg(mdiToothbrush, '#212121'), 'no attributes (compact)', 'mdi:toothbrush', '#212121 (theme text)'),
]));

// Done badge — the smiley is not a chip: it is a session result, latched at the
// end of the run, and between sessions the sensor reads `off`. Drawn here at
// 34px, the size it actually gets in the badge.
const faceCell = (path, color, hexLabel, state, name, code) => `
    <div class="cell">
      <div class="ic" style="height:44px">
        <span style="display:inline-flex;flex-direction:column;align-items:center;gap:1px">
          ${svg(path, color, 1, 34)}
          ${code ? `<span style="font-family:monospace;font-size:8.5px;line-height:1;color:#9ca3af">${code}</span>` : ''}
        </span>
      </div>
      <div class="st">${state}</div>
      <div class="nm">${name}</div>
      <div class="hx"><span class="sw" style="background:${color}"></span>${hexLabel}</div>
    </div>`;

badge.push(section('Oral-B display face', ['oralb_live'],
    'One of three things that can fill the verdict slot - no handle reports more than one. The handle\'s own verdict (FF0A), latched at the end of a session and shown beside the badge text, never as a chip: between sessions the sensor reads "off", and during a session the face is a running assessment that climbs as the session goes on, so only the value it settles on is a verdict on the whole of it. Read from the last-session record where the integration files it (oralb_live 0.7.30+), so it outlives the display, which sleeps about a minute after the session. 34px, well above the 24px chip size: the star-eyes face collapses to dots below that. Gold is deliberately absent — it belongs to the score chip, and a third accent clashes with a badge that is already green or amber; "perfect" and "excellent" share green and are told apart by shape. Values 2–6 were decoded in August 2026 from advertisement captures photographed against the handle display (issue #20); special_7 to 9 still show a question mark plus their raw name so users can report what their handle displayed.', [
    faceCell(smiley.SMILEY_MEDAL, C.green, '#16a34a', 'special_11 — perfect', 'mdi:medal — time AND pressure fulfilled'),
    faceCell(smiley.SMILEY_STAR_EYES, C.green, '#16a34a', 'special_10 — excellent', 'card-own SVG — star eyes, full smile'),
    faceCell(smiley.SMILEY_STAR_EYES, C.green, '#16a34a', 'special_6 — excellent', 'card-own SVG — star eyes on an overtime run'),
    faceCell(smiley.SMILEY_HAPPY, C.green, '#16a34a', 'special_5 — good', 'mdi:emoticon-happy-outline — a completed run'),
    faceCell(smiley.SMILEY_HAPPY, C.green, '#16a34a', 'special_4 — good', 'mdi:emoticon-happy-outline — half smile'),
    faceCell(smiley.SMILEY_NEUTRAL, C.amber, '#d97706', 'special_2, special_3 — fair', 'mdi:emoticon-neutral-outline — the two neutral variants'),
    faceCell(smiley.SMILEY_SAD, C.red, '#dc2626', 'standard — poor', 'mdi:emoticon-sad-outline — the frown, a session barely begun'),
    faceCell(smiley.SMILEY_UNKNOWN, C.muted, '#9ca3af (muted)', 'special_7 … special_9', 'mdi:help-circle-outline + raw value', 'special_7'),
    faceCell(smiley.SMILEY_UNKNOWN, C.muted, '#9ca3af (muted)', 'any future value', 'mdi:help-circle-outline + raw value', 'special_12'),
]));

// The other half of the same slot. Shown here as well as in the chip group,
// because the question this group answers is "what can appear on my badge" -
// and a reader who only saw the Oral-B face above would conclude, wrongly,
// that a badge without one is broken.
// The third thing that can fill the slot, and the only one the card forms
// itself. It belongs on this page for the same reason as the other two: a
// reader who sees a face on their badge wants to know what it means, and on a
// Sonicare no sensor anywhere reports it.
badge.push(section('Verdict the card forms', ['philips_sonicare_ble · every model'], 'Where the handle reports neither a face nor a score but files a record of what it did, the card reads the session out of that record and forms the verdict itself. Two things decide it: how much of its routine the session ran, measured against the routine <em>that session</em> was running, and - where the record carries it - how much of that time was brushed too hard. Ran less than half → sad; 50–90 %, or a full run pressed hard (&gt;10 %) → neutral; a full run with the pressure unknown or ordinary (&lt;10 %) → smile; a full run brushed gently (&lt;2 %) → star eyes. The top tier is the one place the pressure figure is required, so a record without it reads one step below - the best the data supports rather than the best there is. A handle with no pressure sensor at all, a kids brush, is still judged, because everything under the smile is decided on time alone. Hovering it says the card worked it out: an opinion the card formed must not read as something the handle reported.', [
    faceCell(smiley.SMILEY_STAR_EYES, C.green, '#16a34a', 'excellent', 'card-own SVG — full run, brushed gently'),
    faceCell(smiley.SMILEY_HAPPY, C.green, '#16a34a', 'good', 'mdi:emoticon-happy-outline — full run, pressure unknown or ordinary'),
    faceCell(smiley.SMILEY_NEUTRAL, C.amber, '#d97706', 'fair', 'mdi:emoticon-neutral-outline — 50–90 %, or full but pressed hard'),
    faceCell(smiley.SMILEY_SAD, C.red, '#dc2626', 'poor', 'mdi:emoticon-sad-outline — under half the routine'),
]));

badge.push(section('Xiaomi score', ['xiaomi_ble'], 'Same star and same tiers as the score chip, drawn at badge size. Xiaomi reports a score only as the handle switches off, so it describes the session that just ended - which is what the badge is for. No handle reports more than one of the three, so the slot never has to choose between them. Unlike the chip, only a numeric score reaches the badge: the chip can show a full gold star for a value it cannot rank, but a verdict slot showing the best possible star for an unranked value would be a claim, not a reading.', [
    faceCell(mdiStarOutline, C.red, '#dc2626', '&lt; 60', 'mdi:star-outline'),
    faceCell(mdiStarHalfFull, C.amber, '#d97706', '60–84', 'mdi:star-half-full'),
    faceCell(mdiStar, C.gold, '#c47f16', '≥ 85', 'mdi:star'),
]));

const swatch = (hex, role, where) => `
    <div class="cell">
      <div class="ic"><span class="bigsw" style="background:${hex}"></span></div>
      <div class="st">${role}</div>
      <div class="nm">${where}</div>
      <div class="hx">${hex}</div>
    </div>`;
other.push(section('Other colour roles (not state icons)', null, 'Design tones — deliberately outside the traffic-light palette.', [
    swatch('#2563eb', 'Chip blue', 'mode chip, selector, compact hint'),
    swatch('#3b82f6', 'Progress start', 'gradient start (blue)'),
    swatch('#16a34a', 'Progress end', 'gradient end (= traffic-light green)'),
    swatch('#bbf7d0', 'Tooth "brushed"', 'tooth-ring fill + banner border'),
    swatch('#f0fdf4', 'Banner background', '"Brushing complete!" strip'),
    swatch('#15803d', 'Banner text', '"Brushing complete!" strip'),
    swatch('#0082fc', 'BT active blue', 'bluetooth icon during a session'),
    swatch('#9ca3af', 'Muted', 'unavailable states, disconnected icons'),
]));

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Toothbrush Card — icon &amp; colour reference</title>
<style>
  body { margin:0; padding:28px; background:#1c1c1e; font-family:Roboto,sans-serif; }
  h1 { text-align:center; color:#e5e7eb; font-size:18px; font-weight:600; margin:0 0 4px; }
  .sub { text-align:center; color:#9ca3af; font-size:12px; margin:0 0 24px; }
  /* One panel per card area, so the white section cards read as members of a
     group rather than as one long undifferentiated stack. */
  .group { max-width:1100px; margin:0 auto 26px; padding:16px 16px 4px;
           background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
           border-radius:18px; }
  .ghead { display:flex; align-items:baseline; gap:14px; flex-wrap:wrap;
           padding:0 4px 10px; margin:0 0 14px; border-bottom:1px solid rgba(255,255,255,.1); }
  .ghead h2 { font-size:13px; font-weight:700; color:#e5e7eb; margin:0;
              letter-spacing:.1em; text-transform:uppercase; white-space:nowrap; }
  .ghead p { font-size:11px; color:#9ca3af; margin:0; flex:1; min-width:280px; }
  .section { background:#fff; border-radius:12px; padding:16px 18px;
             margin:0 0 14px; box-shadow:0 4px 16px rgba(0,0,0,.4); }
  .head { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin:0 0 4px; }
  h3 { font-size:14px; color:#212121; margin:0; }
  .pills { display:flex; gap:4px; flex-wrap:wrap; }
  .pill { font-size:10px; font-weight:600; font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
          padding:2px 8px; border-radius:999px; background:#eef1f5; color:#3f4756;
          border:1px solid #dde3ea; white-space:nowrap; }
  .pill i { font-style:normal; font-weight:500; color:#8b93a1; }
  .pill i:before { content:" · "; }
  .note { font-size:11px; color:#6b7280; margin:0 0 12px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }
  .cell { border:1px solid #e5e7eb; border-radius:10px; padding:10px 8px 8px;
          display:flex; flex-direction:column; align-items:center; gap:3px; }
  .ic { height:32px; display:flex; align-items:center; }
  .st { font-size:11px; font-weight:700; color:#212121; text-align:center; }
  .nm { font-size:10px; color:#6b7280; text-align:center; }
  .hx { font-size:10px; font-family:monospace; color:#374151; display:flex; align-items:center; gap:4px; }
  .sw { width:10px; height:10px; border-radius:3px; display:inline-block; border:1px solid #d1d5db; }
  .bigsw { width:44px; height:26px; border-radius:6px; display:inline-block; border:1px solid #d1d5db; }
</style>
</head>
<body>
<h1>Toothbrush Card — icon &amp; colour reference</h1>
<p class="sub">Traffic-light palette: green #16a34a · amber #d97706 · red #dc2626 · gold #c47f16 — generated by scripts/gen_icon_overview.mjs</p>
<p class="sub">Last generated: ${generated} · toothbrush-card v${version}</p>
${group('Header',
    'The strip along the top of the card: how the card is hearing from the handle, and the way into the device page. These are transport states, never brushing ones - which is why they are the only icons that stay put while a session runs. Card-own SVG at 18px throughout, and all of them separate their states by weight and shape rather than by colour alone.',
    header)}
${group('Chips &amp; corner markers',
    'One reading each. In the wide layout they sit in the chip row as icon + label + value; in the compact layout (≤ 350px) the label and value go and the icon alone carries the state, either in the row or as a corner marker on the tooth diagram. Same icon in both places - only the size changes.',
    chips)}
${group('Done badge',
    'Not a chip, and the one exception to the grid above: a single verdict on the session that just finished, latched at its end and cleared at the next start. There is one slot for it, and exactly one of the two below fills it - which of them depends on the handle, not on a setting.',
    badge)}
${group('Palette',
    'Tones that carry no state of their own.',
    other)}
</body>
</html>
`;
mkdirSync(join(repoRoot, 'docs'), { recursive: true });
writeFileSync(join(repoRoot, 'docs/icon-overview.html'), html);
console.log('written: docs/icon-overview.html,', html.length, 'bytes');
