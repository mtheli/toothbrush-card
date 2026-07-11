# Toothbrush Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/default)
[![GitHub Release](https://img.shields.io/github/v/release/mtheli/toothbrush-card)](https://github.com/mtheli/toothbrush-card/releases)
[![License: MIT](https://img.shields.io/github/license/mtheli/toothbrush-card)](LICENSE)

A **Custom Lovelace Card** for [Home Assistant](https://www.home-assistant.io/) designed to visualize **electric toothbrushes** via Bluetooth LE integrations.

### Supported Integrations

| Brand | Integration | Link |
|-------|------------|------|
| Oral-B | `oralb` | [Oral-B Integration](https://www.home-assistant.io/integrations/oralb/) (official, built into HA Core) |
| Philips Sonicare | `philips_sonicare_ble` | [philips_sonicare_ble](https://github.com/mtheli/philips_sonicare_ble) (custom component) |
| Xiaomi (T700) | `xiaomi_ble` | [Xiaomi BLE](https://www.home-assistant.io/integrations/xiaomi_ble/) (official, built into HA Core) — beta: the passive broadcast has no live timer/sectors, so the card shows a synthesized session timer with time-based quadrants, plus battery, score and brush-head chips |

**Planned / in progress:** Laifen — waiting on device testing ([#9](https://github.com/mtheli/toothbrush-card/issues/9))

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
- Multi-language support (auto-detects Home Assistant language)
- Light and dark mode support via HA CSS variables

## Supported Data Points

| Sensor    | Oral-B                          | Philips Sonicare                          |
|-----------|---------------------------------|-------------------------------------------|
| Status    | idle, running, charging, …      | off, standby, run, charge, …              |
| Sector    | Reported by device (1–6)        | Calculated from routine time (4 or 6 sectors, configurable) |
| Duration  | Brushing session (seconds)      | Brushing time (seconds)                   |
| Pressure  | low, normal, high               | —                                         |
| Intensity | —                               | low, medium, high                         |
| Mode      | Daily Clean, Sensitive, Turbo, …| Clean, White+, Gum Health, Deep Clean+    |
| Battery   | Battery level (%)               | Battery level (%)                          |

## Community

- [Smartes Badezimmer? So hilft dir ein Shelly Wall Display beim Zähneputzen & Rasieren!](https://www.youtube.com/watch?v=ROI91x2Swv8) — Video by [@smartmatic](https://github.com/smartmatic) showing the card on a Shelly Wall Display alongside the Philips Shaver integration (German)

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

### Teeth graphic

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| tooth_style   | `teeth` \| `none` | `teeth` | `none` hides the tooth ring and shows a large standalone timer instead; the sector-segmented progress bar still shows where you are |
| tooth_color   | string   | divider color | Idle tooth color (hex). Set this if the teeth are invisible against your theme background |
| active_color  | string   | `#93c5fd` | Color of the currently-brushing sector (hex) |
| done_color    | string   | `#bbf7d0` | Color of completed sectors (hex)           |
| num_sectors   | 4 \| 6   | auto    | Override sector count. Auto-detected from the integration (Oral-B and Sonicare both expose it); manual override only needed as a fallback (e.g. unknown model or the diagnostic entity disabled) |
| sector_order  | string[] | —       | Custom sector order (drag & drop in UI)      |

### Layout

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| layout        | object   | —       | Place the readings (`battery`, `pressure`, `intensity`, `mode`, `score`, `brush_head`) freely: up to three chips in the top row (`layout.chips`) and four corner markers (`layout.corners.top_left` … `bottom_right`). Each reading can be used once; omitting `layout` keeps the classic arrangement. Editable in the UI. |

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

## Supported Languages

| Language | Code |
|----------|------|
| English    | en   |
| Deutsch    | de   |
| Nederlands | nl   |

The card automatically detects the language configured in your Home Assistant instance. If your language is not yet supported, it falls back to English. Contributions for additional languages are welcome — just add a new JSON file in `src/locales/`.

## Known Issues

- **6-sector brushes (IO Series):** The [oralb_ble integration](https://github.com/Bluetooth-Devices/oralb-ble) only maps sectors 1–4. When a 6-sector brush reaches sectors 5 or 6, the integration incorrectly reports them as sector 4. The card includes a client-side workaround that tracks brushing progress and auto-advances past duplicate sectors, but the root cause needs to be fixed upstream in the oralb_ble parser.

## Development

```bash
git clone https://github.com/mtheli/toothbrush-card.git
cd toothbrush-card
npm install
npm run build
```

## Disclaimer

This is an independent community project and is not affiliated with, endorsed by, or sponsored by Philips or Oral-B. All product names, trademarks, and registered trademarks are property of their respective owners.

## License

MIT License — see [LICENSE](LICENSE)
