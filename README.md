# Toothbrush Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/mtheli/toothbrush-card)](https://github.com/mtheli/toothbrush-card/releases)
[![License: MIT](https://img.shields.io/github/license/mtheli/toothbrush-card)](LICENSE)

A **Custom Lovelace Card** for [Home Assistant](https://www.home-assistant.io/) designed to visualize **Oral-B toothbrushes** integrated via the official `oralb` integration.

![Toothbrush Card Preview](images/preview.png)

---

## Features

- Real-time brushing visualization with animated tooth SVG
- Chip-based display for battery, pressure, and brushing mode
- Bluetooth connection status indicator
- Progress bar based on 2-minute brushing target
- Success badge when all 4 quadrants are complete
- Automatic entity discovery — no manual YAML required
- Configurable title and subtitle
- Responsive layout with container queries
- Light and dark mode support via HA CSS variables

## Supported Data Points

| Sensor   | Description                                      |
|----------|--------------------------------------------------|
| Status   | Device state (idle, running, charging, …)        |
| Sector   | Current brushed quadrant (1–4) or success        |
| Duration | Brushing session duration (seconds)              |
| Pressure | Brushing pressure (low, normal, high)            |
| Mode     | Brushing mode (Daily Clean, Sensitive, Turbo, …) |
| Battery  | Battery level (%)                                |

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

The card is configured via the UI — just add it and select your Oral-B device.

| Option        | Type    | Default | Description                          |
|---------------|---------|---------|--------------------------------------|
| device_id     | string  | —       | **(required)** Oral-B device to use  |
| title         | string  | —       | Custom title (default: manufacturer) |
| show_subtitle | boolean | true    | Show device name as subtitle         |

### YAML Example
```yaml
type: custom:toothbrush-card
device_id: 1234567890abcdef
title: My Toothbrush
show_subtitle: true
```

## Development

```bash
git clone https://github.com/mtheli/toothbrush-card.git
cd toothbrush-card
npm install
npm run build
```

## License

MIT License — see [LICENSE](LICENSE)
