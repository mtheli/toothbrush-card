# Toothbrush Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/mtheli/toothbrush-card)](https://github.com/mtheli/toothbrush-card/releases)
[![License: MIT](https://img.shields.io/github/license/mtheli/toothbrush-card)](LICENSE)

A **Custom Lovelace Card** for [Home Assistant](https://www.home-assistant.io/) designed to visualize **electric toothbrushes** via Bluetooth LE integrations.

### Supported Integrations

| Brand | Integration | Link |
|-------|------------|------|
| Oral-B | `oralb` | [Oral-B Integration](https://www.home-assistant.io/integrations/oralb/) (official, built into HA Core) |
| Philips Sonicare | `philips_sonicare_ble` | [philips_sonicare_ble](https://github.com/theli/philips_sonicare_ble) (custom component) |

![Toothbrush Card Preview](images/preview.png)

---

## Features

- Real-time brushing visualization with animated tooth SVG (4 or 6 sectors)
- Chip-based display for battery, pressure/intensity, and brushing mode
- Bluetooth connection status indicator (Pantone 285 blue)
- Progress bar based on brushing target (uses device routine length when available)
- Success badge when all sectors are complete
- Automatic entity discovery — no manual YAML required
- Sector tracking: device-reported (Oral-B) or time-based calculation (Sonicare)
- Configurable title, subtitle, and accent color
- Configurable sector order with drag & drop and up/down buttons
- Responsive layout with container queries (icon-only chips on narrow cards)
- Multi-language support (auto-detects Home Assistant language)
- Light and dark mode support via HA CSS variables

## Supported Data Points

| Sensor    | Oral-B                          | Philips Sonicare                          |
|-----------|---------------------------------|-------------------------------------------|
| Status    | idle, running, charging, …      | off, standby, run, charge, …              |
| Sector    | Reported by device (1–6)        | Calculated from routine time (4 quadrants)|
| Duration  | Brushing session (seconds)      | Brushing time (seconds)                   |
| Pressure  | low, normal, high               | —                                         |
| Intensity | —                               | low, medium, high                         |
| Mode      | Daily Clean, Sensitive, Turbo, …| Clean, White+, Gum Health, Deep Clean+    |
| Battery   | Battery level (%)               | Battery level (%)                          |

## Installation

### HACS (Recommended)
1. Open **HACS → Frontend → Custom Repositories**
2. Add the repository: `https://github.com/mtheli/toothbrush-card`
3. Install **Toothbrush Card**
4. Refresh your Home Assistant dashboard

### Manual
1. Download `dist/toothbrush-card.js` from the [latest release](https://github.com/mtheli/toothbrush-card/releases)
2. Copy it to `/config/www/community/toothbrush-card/`
3. Add as a Lovelace resource:
```yaml
resources:
  - url: /local/community/toothbrush-card/toothbrush-card.js
    type: module
```

## Configuration

The card is configured via the UI — just add it and select your toothbrush device.

| Option        | Type     | Default | Description                                  |
|---------------|----------|---------|----------------------------------------------|
| device_id     | string   | —       | **(required)** Toothbrush device to use      |
| title         | string   | —       | Custom title (default: manufacturer)         |
| show_subtitle | boolean  | true    | Show device name as subtitle                 |
| accent_color  | string   | —       | Header accent color (hex, e.g. `#0085FF`)    |
| sector_order  | string[] | —       | Custom sector order (e.g. for 6-sector mode) |

### YAML Example
```yaml
type: custom:toothbrush-card
device_id: 1234567890abcdef
title: My Toothbrush
show_subtitle: true
accent_color: "#0085FF"
```

## Supported Languages

| Language | Code |
|----------|------|
| English  | en   |
| Deutsch  | de   |

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

## License

MIT License — see [LICENSE](LICENSE)
