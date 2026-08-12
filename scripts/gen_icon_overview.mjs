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
//           --window-size=1120,2560 --hide-scrollbars docs/icon-overview.html
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
for (const key of ['bluetooth', 'lan_connect', 'lan_disconnect', 'charger']) {
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

const section = (title, note, cells) => `
  <div class="section">
    <h2>${title}</h2>
    ${note ? `<p class="note">${note}</p>` : ''}
    <div class="grid">${cells.join('')}</div>
  </div>`;

// Brush-head glyph: capsule with quarter-step fill, as drawn by headSvg()
const headSvg = (steps, color, size = 28) => {
    const clipY = 30 - steps * 7.5;
    const cap = 'M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z';
    const id = `hf${steps}${color.slice(1)}`;
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

const sections = [];

sections.push(section('Header — connection icons', 'Card-own SVG paths (CONN_ICONS in icons.js), 18px. Told apart by presence, not by hue: a connection carrying something reads at full strength, one that is merely established is quieter, a broken one fades out. Colour alone could not do it - the active tone and the theme primary can be the same blue.', [
    cell(svg(conn.bluetooth, C.primary, 0.55), 'BT connected, idle', 'bluetooth', 'var(--primary-color) op.0.55'),
    cell(svg(conn.bluetooth, C.btActive), 'BT active (session)', 'bluetooth', '#0082fc op.1'),
    cell(svg(conn.bluetooth, C.muted, 0.3), 'BT disconnected', 'bluetooth', '#9ca3af op.0.3'),
    cell(svg(conn.lan_connect, C.primary, 0.55), 'ESP bridge online', 'lan_connect', 'var(--primary-color) op.0.55'),
    cell(svg(conn.lan_disconnect, C.muted, 0.3), 'ESP bridge offline', 'lan_disconnect', '#9ca3af op.0.3'),
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
sections.push(section('Charger — header (oralb_live)', 'Shown only when the handle is paired with a charging station (charger_address on the main entity). Full strength while the data actually arrives through it (data_source = charger_bridge), quieter otherwise — an idle station is the normal state between sessions, not a fault.', [
    cell(svg(conn.charger, C.btActive), 'data via charger', 'card-own SVG (CONN_ICONS.charger)', '#0082fc op.1'),
    cell(svg(conn.charger, C.primary, 0.55), 'charger paired, idle', 'card-own SVG (CONN_ICONS.charger)', 'var(--primary-color) op.0.55'),
]));

sections.push(section('Battery — chip + corner', 'Icon step: ceil(level/10)·10 (_getBatteryIcon) · colour: ≤15 red, ≤30 amber, otherwise green (_getBatteryChipColor).', batLevels.map(([p, s, n, c, hx]) => cell(svg(p, c), s, `mdi:${n}`, hx))));

sections.push(section('Pressure — chip + corner', 'A drawn staircase rather than an icon, so the level is visible without reading the value. Chip and corner show the same bars. Traffic-light palette: pressing too hard is a warning, unlike intensity.', [
    cell(pressureBars(1, C.amber), 'low', 'bars 1/4', '#d97706'),
    cell(pressureBars(2, C.green), 'normal / medium', 'bars 2/4', '#16a34a'),
    cell(pressureBars('all', C.red), 'high', 'bars 4/4', '#dc2626'),
]));

sections.push(section('Intensity — chip + corner', 'A drawn dial rather than an icon: a Laifen handle reports a level of 1-10 (11-20 in the high-frequency mode), and three speedometer variants could express almost none of it. Chip and corner show the same dial, only at different sizes. Deliberately NOT the traffic-light palette — intensity is a chosen setting, a high level must never read as a warning.', [
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
sections.push(section('Mode — chip + corner', 'All modes share one blue; only "unavailable" is muted.',
    modes.map(([s, p, n]) => cell(svg(p, C.blue), s, `mdi:${n}`, '#2563eb'))
        .concat([cell(svg(mdiBrushVariant, C.muted), 'unavailable', 'mdi:brush-variant', '#9ca3af (muted)')])));

sections.push(section('Score — chip + corner', 'Star step + traffic-light colour; the value text takes the same colour. Non-numeric scores keep the full gold star.', [
    cell(svg(mdiStarOutline, C.red), '&lt; 60', 'mdi:star-outline', '#dc2626'),
    cell(svg(mdiStarHalfFull, C.amber), '60–84', 'mdi:star-half-full', '#d97706'),
    cell(svg(mdiStar, C.gold), '≥ 85', 'mdi:star', '#c47f16'),
    cell(svg(mdiStar, C.gold), 'non-numeric', 'mdi:star', '#c47f16'),
]));

sections.push(section('Brush head — chip + corner', 'Card-own glyph. Fill steps in quarters (by % remaining); colour follows wear (_getBrushheadColor): &gt;40 green, 21–40 amber, ≤20 red → 6 visible states. The value text takes the same colour (like battery).', [
    cell(headSvg(4, C.green), '100–76 %', '4/4 segments', '#16a34a'),
    cell(headSvg(3, C.green), '75–51 %', '3/4 segments', '#16a34a'),
    cell(headSvg(2, C.green), '50–41 %', '2/4 segments', '#16a34a'),
    cell(headSvg(2, C.amber), '40–26 %', '2/4 segments', '#d97706'),
    cell(headSvg(1, C.amber), '25–21 %', '1/4 segments', '#d97706'),
    cell(headSvg(1, C.red), '20–0 %', '1/4 segments', '#dc2626'),
]));

const letterGlyph = (letter) =>
    `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:1px">${svg(mdiToothbrush, '#212121', 1, 22)}<span style="font-size:9px;font-weight:800;line-height:1;color:#212121">${letter}</span></span>`;
sections.push(section('Head type — chip + corner', 'Neutral, no state colours: the type is information, not a warning. Wide layout: mdi:toothbrush + short family name. Compact icon-only layout: the family letter (the A in "A3") is tucked under the icon. Name and letter come from the type sensor’s family_name/family_letter attributes (single source in the integration; C/W/G/A/S official, T/N stand-ins for TongueCare+ and non-RFID). Without the attributes the full state text is shown, wrapped/clamped to two lines, with a plain icon. Hidden while no head is attached.', [
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

sections.push(section('Oral-B display face — done badge (oralb_live)',
    'The handle\'s own verdict (FF0A), latched at the end of a session and shown beside the badge text — never as a chip, because the sensor reads "off" between sessions and changes with pressure while brushing. 34px, well above the 24px chip size: the star-eyes face collapses to dots below that. Gold is deliberately absent — it belongs to the score chip, and a third accent clashes with a badge that is already green or amber; "perfect" and "excellent" share green and are told apart by shape. Only three values are decoded (issue #20); every other value shows a question mark plus its raw name so users can report what their handle displayed.', [
    faceCell(smiley.SMILEY_MEDAL, C.green, '#16a34a', 'special_11 — perfect', 'mdi:medal — time AND pressure fulfilled'),
    faceCell(smiley.SMILEY_STAR_EYES, C.green, '#16a34a', 'special_10 — excellent', 'card-own SVG — star eyes, full smile'),
    faceCell(smiley.SMILEY_HAPPY, C.green, '#16a34a', 'standard — good', 'mdi:emoticon-happy-outline'),
    faceCell(smiley.SMILEY_NEUTRAL, C.amber, '#d97706', 'reserved — fair', 'mdi:emoticon-neutral-outline (no value yet)'),
    faceCell(smiley.SMILEY_SAD, C.red, '#dc2626', 'reserved — poor', 'mdi:emoticon-sad-outline (no value yet)'),
    faceCell(smiley.SMILEY_UNKNOWN, C.muted, '#9ca3af (muted)', 'special_2 … special_9', 'mdi:help-circle-outline + raw value', 'special_7'),
    faceCell(smiley.SMILEY_UNKNOWN, C.muted, '#9ca3af (muted)', 'any future value', 'mdi:help-circle-outline + raw value', 'special_12'),
]));

const swatch = (hex, role, where) => `
    <div class="cell">
      <div class="ic"><span class="bigsw" style="background:${hex}"></span></div>
      <div class="st">${role}</div>
      <div class="nm">${where}</div>
      <div class="hx">${hex}</div>
    </div>`;
sections.push(section('Other colour roles (not state icons)', 'Design tones — deliberately outside the traffic-light palette.', [
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
  .section { background:#fff; border-radius:12px; padding:16px 18px; max-width:1060px;
             margin:0 auto 20px; box-shadow:0 4px 16px rgba(0,0,0,.4); }
  h2 { font-size:14px; color:#212121; margin:0 0 2px; }
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
${sections.join('\n')}
</body>
</html>
`;
mkdirSync(join(repoRoot, 'docs'), { recursive: true });
writeFileSync(join(repoRoot, 'docs/icon-overview.html'), html);
console.log('written: docs/icon-overview.html,', html.length, 'bytes');
