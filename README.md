# Toothbrush Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/default)
[![GitHub Release](https://img.shields.io/github/v/release/mtheli/toothbrush-card)](https://github.com/mtheli/toothbrush-card/releases)
[![License: MIT](https://img.shields.io/github/license/mtheli/toothbrush-card)](LICENSE)

A **Custom Lovelace Card** for [Home Assistant](https://www.home-assistant.io/) designed to visualize **electric toothbrushes** via Bluetooth LE integrations.

### Toothbrush Integrations

| Brand | Integration | Status | Notes |
| :--- | :--- | :---: | :--- |
| Oral-B | [`oralb`](https://www.home-assistant.io/integrations/oralb/) (official, built into HA Core) | ✅ | Live timer and device-reported sectors |
| Philips Sonicare | [`philips_sonicare_ble`](https://github.com/mtheli/philips_sonicare_ble) (custom component) | ✅ | Live timer, time-based sectors |
| Xiaomi T700 | [`xiaomi_ble`](https://www.home-assistant.io/integrations/xiaomi_ble/) (official, built into HA Core) | ✅ | Verified on a real T700 — the passive broadcast has no live timer/sectors, so the card shows a synthesized session timer with time-based quadrants, plus battery, score and brush-head chips |
| Laifen | [`laifen_ble`](https://github.com/UrbanTechIO/Laifen) (custom component) | ✅ | Live timer, time-based sectors (aligned with the handle's 30s pacer when enabled), mode select, battery and (Wave Pro) pressure warning — for Wave and Wave Pro, works with laifen_ble 3.0.2 and newer |
| Other Xiaomi models (T500, …) | `xiaomi_ble` | 🧪 | Untested — likely close to the T700; test reports welcome |
| Oclean | [`oclean_ble`](https://github.com/deniskie/ha-oclean-integration) (custom component) | ⏸️ | Rich per-zone statistics, but only after a session ends — no live brushing state the card could animate. Will revisit if a live status entity becomes available |
| Playbrush | — | ⏸️ | No Home Assistant integration available yet |

✅ supported · 🧪 in progress / testers wanted · ⏸️ not yet sensible

Want support for another brush? [Open an issue](https://github.com/mtheli/toothbrush-card/issues) — an integration with a live brushing state is the main requirement.

![Oral-B](screenshots/OralB.png) ![Sonicare](screenshots/Sonicare.png)

---

## Features

- Real-time brushing visualization with animated tooth SVG (4 or 6 sectors)
- Chip-based display for battery, pressure/intensity, brushing mode, score and brush head
- Configurable layout: place every reading as a chip or a corner marker — or hide it
- Compact panel mode: hideable header and tooth ring with a large standalone timer (two cards fit side by side on a 480×480 wall panel)
- Bluetooth connection status indicator (Pantone 285 blue)
- Sector-segmented progress bar based on the brushing target (uses the device routine length when available)
- Success badge when all sectors are complete
- Automatic entity discovery — no manual YAML required
- Sector tracking: device-reported (Oral-B) or time-based calculation (Sonicare, Xiaomi)
- Configurable title, subtitle, and accent color
- Configurable tooth, active-sector, and completed-sector colors
- Configurable sector order with drag & drop and up/down buttons
- Responsive layout with container queries (icon-only chips on narrow cards)
- State-driven icons: battery, pressure, score and brush head step their icon shape and colour with the value, so they stay readable even icon-only — see the [icon & colour reference](docs/ICONS.md)
- Multi-language support (auto-detects Home Assistant language)
- Light and dark mode support via HA CSS variables

## Supported Data Points

| Sensor    | Oral-B                          | Philips Sonicare                          | Xiaomi (T700, beta)                     |
|-----------|---------------------------------|-------------------------------------------|------------------------------------------|
| Status    | idle, running, charging, …      | off, standby, run, charge, …              | running / idle (from the on/off state)   |
| Sector    | Reported by device (1–6)        | Calculated from routine time (4 or 6 sectors, configurable) | Calculated from routine time (4 quadrants × 30 s) |
| Duration  | Brushing session (seconds)      | Brushing time (seconds)                   | Synthesized (time since the brush turned on) |
| Pressure  | low, normal, high               | normal, high (pressure state on newer handles, pressure alert on others) | —                                        |
| Intensity | —                               | low, medium, high                         | —                                        |
| Mode      | Daily Clean, Sensitive, Turbo, …| Clean, White+, Gum Health, Deep Clean+    | —                                        |
| Score     | —                               | —                                         | 0–100 (reported after each session)      |
| Brush head| —                               | Wear (%)                                  | Condition (%)                            |
| Battery   | Battery level (%)               | Battery level (%)                          | Battery level (%)                        |

## Community

[<img src="https://img.youtube.com/vi/ROI91x2Swv8/maxresdefault.jpg" alt="Smartes Badezimmer? So hilft dir ein Shelly Wall Display beim Zähneputzen & Rasieren!" width="480">](https://www.youtube.com/watch?v=ROI91x2Swv8)

[Smartes Badezimmer? So hilft dir ein Shelly Wall Display beim Zähneputzen & Rasieren!](https://www.youtube.com/watch?v=ROI91x2Swv8) — Video by [@smartmatic](https://github.com/smartmatic) showing the card on a Shelly Wall Display alongside the Philips Shaver integration (German)

## Installation

### HACS (Recommended)

This card is available in the **default HACS store** — just click the button below, or search HACS for "Toothbrush Card".

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mtheli&repository=toothbrush-card&category=plugin)

Then refresh your Home Assistant dashboard.

<details>
<summary>Manual installation</summary>

1. Download `dist/toothbrush-card.js` from the [latest release](https://github.com/mtheli/toothbrush-card/releases)
2. Copy it to `/config/www/community/toothbrush-card/`
3. Add as a Lovelace resource:
```yaml
resources:
  - url: /local/community/toothbrush-card/toothbrush-card.js
    type: module
```

</details>

## Configuration

The card is configured via the UI — just add it and select your toothbrush device. The options below are grouped the same way as in the card editor.

### Device

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| device_id     | string   | —       | **(required)** Toothbrush device to use      |

### Header

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| show_header   | boolean  | true    | `false` hides the whole card header (title, connection icons, menu) — useful for compact wall-panel dashboards |
| title         | string   | —       | Custom title (default: manufacturer)         |
| show_subtitle | boolean  | true    | Show device name as subtitle                 |
| accent_color  | string   | —       | Header accent color (hex, e.g. `#0085FF`)    |

### Visualization

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| tooth_style   | `teeth` \| `none` | `teeth` | `none` hides the tooth ring and shows a large standalone timer instead; the sector-segmented progress bar still shows where you are |
| tooth_color   | string   | divider color | Idle tooth color (hex). Set this if the teeth are invisible against your theme background |
| active_color  | string   | `#93c5fd` | Color of the currently-brushing sector (hex) |
| done_color    | string   | `#bbf7d0` | Color of completed sectors (hex)           |
| progress_size | string   | `slim`  | Height of the progress bar: `slim` (4 px), `bold` (8 px) or `xl` (12 px) — the bigger sizes keep the bar readable from a distance on wall panels. |
| scale         | number   | `1.0`   | Scales the visual area — tooth ring, timer, status, corner markers and progress bar — between `0.8` and `2.0` for at-a-distance readability. Header and chips keep their size. |

### Sectors

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| num_sectors   | 4 \| 6   | auto    | Override sector count. Auto-detected from the integration (Oral-B and Sonicare both expose it); manual override only needed as a fallback (e.g. unknown model or the diagnostic entity disabled) |
| sector_order  | string[] | —       | Custom sector order (drag & drop in UI)      |

### Layout

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| head_display  | string   | `remaining` | What the brush-head reading shows: `remaining` (% left), `used` (% worn), or `sessions` (estimated sessions left — needs the integration's Sessions Left sensor, falls back to `remaining` without it). |
| layout        | object   | —       | Place the readings (`battery`, `pressure`, `intensity`, `mode`, `score`, `brush_head`, `head_type`) freely: up to four chips in the top row (`layout.chips`) and four corner markers (`layout.corners.top_left` … `bottom_right`). Each reading can be used once; omitting `layout` keeps the classic arrangement. Editable in the UI. |

### Behavior

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| hold_duration | number   | 0.5     | How long to keep showing the finished session (done badge + final time + "x min ago"), in hours: `0.25`–`24`, or `0` = until the next brushing session starts. The held view survives page reloads and can be dismissed early with the ×  on the badge. |
| hold_completed | boolean | true    | Legacy switch for the same feature: `false` disables holding the finished session entirely (same as "Off" in the editor). |
| routine_length | number  | auto    | Override the routine length in seconds (YAML only). Normally read from the device; mainly for brushes without one (e.g. Xiaomi, default `120`) whose session timer is synthesized |

### YAML Example
```yaml
type: custom:toothbrush-card
device_id: 1234567890abcdef
title: My Toothbrush
show_subtitle: true
accent_color: "#0085FF"
tooth_color: "#d1d5db"
active_color: "#93c5fd"
done_color: "#bbf7d0"
```

### Compact example (small wall panels)

Two of these fit side by side on a 480×480 panel (e.g. NSPanel Pro) —
no header, no tooth ring, big timer, battery and mode flanking the
status line:

```yaml
type: custom:toothbrush-card
device_id: 1234567890abcdef
show_header: false
tooth_style: none
layout:
  chips: []
  corners:
    bottom_left: battery
    bottom_right: mode
```

The compact view (`tooth_style: none`) — shown here with the header and chips still enabled:

![Compact](screenshots/Compact.png)

## Supported Languages

| Language | Code |
|----------|------|
| English    | en   |
| Deutsch    | de   |
| Nederlands | nl   |

The card automatically detects the language configured in your Home Assistant instance. If your language is not yet supported, it falls back to English. Contributions for additional languages are welcome — just add a new JSON file in `src/locales/`.

## Known Issues

- **6-sector brushes (IO Series):** Older versions of the [oralb_ble library](https://github.com/Bluetooth-Devices/oralb-ble) only map sectors 1–4, so 6-sector brushes see sectors 5/6 reported as sector 4 or as `unknown_sector_code_N`. This is fixed upstream ([oralb-ble#180](https://github.com/Bluetooth-Devices/oralb-ble/pull/180), shipping with Home Assistant 2026.8). Until you are on 2026.8, the card's built-in workaround tracks brushing progress and auto-advances past duplicate sectors.
- **iO Series 10 + iOsense charger:** The iOsense smart charger pairs with the brush and holds its own Bluetooth connection to it whenever the charger is powered (that is how it shows real-time feedback on its LEDs). While that connection is active, the brush stops broadcasting the advertisements that the Home Assistant Oral-B integration listens for — so no entities update during brushing, regardless of how good your Bluetooth proxy or adapter is. Workaround: power the charger only when you actually want to charge (e.g. via a smart plug). See [#3](https://github.com/mtheli/toothbrush-card/issues/3) for details.

## Development

```bash
git clone https://github.com/mtheli/toothbrush-card.git
cd toothbrush-card
npm install
npm run build
```

Contributing a BLE capture for a protocol issue? See [`scripts/oralb/`](scripts/oralb/).

## Disclaimer

This is an independent community project and is not affiliated with, endorsed by, or sponsored by Philips or Oral-B. All product names, trademarks, and registered trademarks are property of their respective owners.

## License

MIT License — see [LICENSE](LICENSE)
