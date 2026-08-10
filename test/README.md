# Tests

```bash
npm run build && npm test
```

The tests drive the built card from `dist/`, so a build has to have run first.
They use Node's own test runner and need no further dependencies.

## How they work

There is no DOM here. `helpers/dom-shim.mjs` provides the handful of globals lit
touches while loading, the card class is taken from the registry, and
`helpers/replay.mjs` calls `render()` per advertisement. What the card decided
is captured by wrapping `_getSectorData` and `_getSectorLabel`, so nothing has
to be parsed back out of a lit template.

`helpers/oralb-integration.mjs` stands in for Home Assistant: it decodes raw
advertisements the way the `oralb_ble` parser does and publishes the entity
states that follow from them. It carries two generations — 1.1.0 as shipped up
to Home Assistant 2026.7, and 1.1.3 as shipped with 2026.8 — because the card
has to work on both.

## Fixtures

Both fixtures are real captures. Only the manufacturer data bytes are stored —
no address, no device name.

- `fixtures/oralb-io10-issue3.json` — an iO Series 10 running a complete
  six-sector routine, contributed by @smartmatic in
  [#3](https://github.com/mtheli/toothbrush-card/issues/3). The same data backed
  the upstream fix
  [Bluetooth-Devices/oralb-ble#180](https://github.com/Bluetooth-Devices/oralb-ble/pull/180).
- `fixtures/oralb-io6-aborted-summary.json` — an iO Series 6 stopped after 51
  seconds and left on its summary screen, contributed by @daronspence in
  [home-assistant/core#169661](https://github.com/home-assistant/core/issues/169661).
  It covers the states a finished session must *not* be inferred from.

Adding a fixture: capture with [`scripts/oralb/adv_capture.py`](../scripts/oralb/),
then keep the frames as hex manufacturer data with their timestamps. Collapsing
consecutive identical advertisements is fine; the brushing time has to keep
advancing, because the card's completion latch reads it.
