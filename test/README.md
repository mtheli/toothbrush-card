# Tests

```bash
npm test          # against src/, no build needed
npm run test:dist # builds, then runs the same suite against the bundle
```

They use Node's own test runner and need no further dependencies.

`npm test` loads the card straight from `src/`, so a failure points at a line
in the source and there is nothing to rebuild between edits. Three things in
the source tree are Parcel's job rather than Node's — the `bundle-text:` CSS
import, the bare JSON locale imports and the extensionless import in
`index.js` — plus `src/build-info.js`, which is generated and therefore absent
in a fresh clone. `helpers/src-loader.mjs` resolves all four as module hooks,
so no source file has to be shaped around the tests.

`npm run test:dist` runs the identical suite against `dist/`, which is what a
release check should use: the bundle is the artifact users install, and only
that run proves Parcel produced it correctly. It is selected by
`helpers/use-dist.mjs` via `--import`, so the test files themselves know
nothing about the target.

## How they work

There is no DOM here. `helpers/dom-shim.mjs` provides the handful of globals lit
touches while loading, the card class is taken from the registry, and
`helpers/replay.mjs` calls `render()` per advertisement. What the card decided
is captured by wrapping `_getSectorData` and `_getSectorLabel`, so nothing has
to be parsed back out of a lit template.

`layout.test.mjs` needs none of that machinery: `normalizeLayout`,
`resolveLayoutForDevice` and `isMainStateEntity` are pure and exported, so they
are imported from src/ and called directly. That import happens in both targets
— index.js does not re-export them, so they cannot be reached through the
bundle, and exercising the same code twice would prove nothing.

`history-recap.test.mjs` is the only file that switches the recorder rebuild
on; everywhere else it is disabled so it cannot fire mid-test. It covers the
history scan on its own (mountains, fumbles, two sessions without a wipe in
between, both row shapes) and then the decision built on it, with `callWS`
stubbed. Note that the fixture there carries a sector entity on purpose:
without one the card synthesises a two-minute routine from time, and the
"no target, no recap" guard could never trigger.

`recap-hold.test.mjs` covers how long a finished session stays on screen.
Those windows are hours long, so the clock is faked with the test runner's own
`t.mock.timers` instead of waited out: the card reads `Date.now()` from the
global at call time, so the fake reaches it either way, and `tick()` jumps past
`hold_duration` without the suite taking any longer.

`helpers/laifen-integration.mjs` works differently, because laifen_ble connects
to the handle instead of listening for advertisements: there is nothing to
decode and no capture to replay, so the fixture is the entity registry plus the
states, built per release (3.0.2 / 3.0.3), model (Wave / Wave Pro) and install
language. It is transcribed from the integration's own sources — see the file
header for which ones. Those tests read the mapping straight out of
`findDeviceEntities` and render once mid-session to check the routine length
the card ends up brushing against.

`helpers/oralb-integration.mjs` stands in for Home Assistant: it decodes raw
advertisements the way the `oralb_ble` parser does and publishes the entity
states that follow from them. It carries two generations — 1.1.0 as shipped up
to Home Assistant 2026.7, and 1.1.3 as shipped with 2026.8 — because the card
has to work on both.

`helpers/sonicare-integration.mjs` does the same for philips_sonicare_ble, but
from a recorded GATT session rather than an advertisement stream — a Sonicare
handle is connection-oriented, so there is nothing to sniff passively. The
recording is JSONL, one line per changed characteristic; the helper decodes it
the way `classic_protocol.py` does and derives the entity states that follow.
The sector is the notable one: the handle never reports it, so the integration
computes it from elapsed time, routine length and a mode-specific visit
sequence — and it is that sequence which makes White+ and Gum Health revisit
sectors the card has already marked done.

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

- `fixtures/sonicare-hx999x-clean-complete.jsonl` — an HX999X Prestige
  (firmware 1.15.4) running a full two-minute Clean routine. Recorded with
  `scripts/sonicare_session_record.py` from the philips_sonicare_ble repo,
  which writes no MAC, serial or device name.

  Its value is the ending: the handle reports `session_complete` for a single
  sample, wipes the brushing timer to 0 in the same instant and then switches
  itself off. That is the case the completion latch exists for, and until this
  recording it was only described in a comment.

  Two known gaps, both properties of this take rather than of the card. It
  starts 28 s into the session, so the first zone is missing; and it is a Clean
  routine, so the White+ / Gum Health revisit path is exercised only through
  `currentSector`, not through a real session.

Adding a fixture: capture with [`scripts/oralb/adv_capture.py`](../scripts/oralb/),
then keep the frames as hex manufacturer data with their timestamps. Collapsing
consecutive identical advertisements is fine; the brushing time has to keep
advancing, because the card's completion latch reads it.
