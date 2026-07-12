# Icon & colour reference

Every state icon the card can show, with its trigger condition, MDI name and
colour value. Battery, pressure, score and brush head share one traffic-light
palette (green `#16a34a` · amber `#d97706` · red `#dc2626` · gold `#c47f16`),
so the same tone always means the same thing. Intensity deliberately uses its
own non-alarming scale — a high intensity is a chosen setting, not a warning.

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
  --window-size=1120,2170 --hide-scrollbars docs/icon-overview.html
```

The state conditions and palette in the script mirror the card logic in
`src/toothbrush-card.js` and must be kept in sync when that logic changes.
