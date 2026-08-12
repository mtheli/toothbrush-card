# Icon & colour reference

Every state icon the card can show, with its trigger condition, MDI name and
colour value. Battery, pressure, score and brush head share one traffic-light
palette (green `#16a34a` · amber `#d97706` · red `#dc2626` · gold `#c47f16`),
so the same tone always means the same thing. Intensity deliberately uses its
own non-alarming scale — a high intensity is a chosen setting, not a warning.
The head type stays neutral (theme text colour) for the same reason: it is
information, not a state.

Two readings are drawn rather than picked from MDI, because no icon set has
the resolution they need. Pressure is a four-bar staircase. Intensity is a
dial: a Laifen handle reports a level of 1–10, and 11–20 in the high-frequency
mode, where three speedometer variants could express almost none of it. The
needle carries the value; the ring behind it is the scale, held back enough
that the needle reads first but not so far that it disappears. Both drawn
readings look the same in the chip and in a corner marker, only at different
sizes, so where a reading is placed never changes what it looks like.

Also worth knowing: the screenshot has to be tall enough for the whole page.
The window height in the command below grows with the reference; if the last
section is clipped, that is the number to raise.

All icons stay readable in the compact icon-only layout (card width ≤ 350 px,
where chip labels and values are hidden): the icon shape and colour alone
carry the state.

![Icon overview](icon-overview.png)

An interactive version with copyable hex values is in
[icon-overview.html](icon-overview.html).

## Regenerating

The overview is generated from `@mdi/js` and the card's own SVG paths:

```sh
node scripts/gen_icon_overview.mjs
chromium --headless --screenshot=docs/icon-overview.png \
  --window-size=1120,2900 --hide-scrollbars docs/icon-overview.html
```

The state conditions and palette in the script mirror the card logic in
`src/toothbrush-card.js` and must be kept in sync when that logic changes.
