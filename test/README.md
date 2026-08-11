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

`editor.test.mjs` never renders the editor. Every control ends in a handler
that builds a new config and dispatches `config-changed`, so the handlers are
called directly and the emitted config is what gets asserted — the same object
Home Assistant would store. The rule running through all of it is that a
default writes *no key*: leaving a setting alone must not litter the YAML, and
switching back to the default has to remove the key again rather than pin it.

`confirm` is deliberately missing from the DOM shim rather than stubbed to
true. The reset-everything handler is gated on it, and a test that forgot to
say so should not have its confirmation waved through — the two tests that need
it answer it explicitly and remove it again.

`xiaomi-render.test.mjs` covers the branches that exist only for Xiaomi: a
binary main entity reporting on/off, a session time synthesised from
`last_changed` because the broadcast carries no timer, the head reading being
inverted because the sensor reports what is left, and the substitute chip row
for a device with neither contact feedback nor a mode. Its registry is built
inline rather than in a helper — unlike laifen_ble and philips_sonicare_ble
there is no decoding and no release history to encode, only four entities
matched by suffix. There is no capture behind it: the card consumes plain
entity states here and compensates for nothing at the advertisement level, so
a raw capture would mostly restate what the registry already says.

`entity-mapping.test.mjs` calls `findDeviceEntities` directly — it is pure, and
it is the seam every integration passes through. The integration-shaped cases
live in the helpers next to it; this file covers the mapping rules themselves,
particularly the order-dependent ones: the main state entity ending up in
`base_entity` rather than `status`, the first-wins device_class fallbacks, and
the `continue` that keeps the laifen branch exclusive. Removing that one line
fails three tests, which is the point of having them.

`history-recap.test.mjs` is the only file that switches the recorder rebuild
on; everywhere else it is disabled so it cannot fire mid-test. It covers the
history scan on its own (mountains, fumbles, two sessions without a wipe in
between, both row shapes) and then the decision built on it, with `callWS`
stubbed. Note that the fixture there carries a sector entity on purpose:
without one the card synthesises a two-minute routine from time, and the
"no target, no recap" guard could never trigger.

`session-latch.test.mjs` is a characterisation of the completed-session latch,
written to protect a refactor rather than to describe a requirement. The latch
is the most intricate thing in the card and lives in nine mutable fields that
`render()` updates as a side effect; it is also integration-agnostic, because
`active` and `duration` are already normalised by the time it runs. The
per-integration files reach it incidentally through whatever fixture they
drive — this one drives it deliberately, as a sequence of samples, and records
what falls out. Where today's behaviour looks questionable it is written down
as-is and said so, so that pulling the state machine out of `render()` cannot
change it unnoticed.

It also holds the one Laifen behaviour that had no coverage: with the handle's
own 30-second pacer switched on, a three-minute routine becomes six zones
instead of four, so card and handle change zone together.

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

  Two known gaps, both properties of this take. It starts 28 s into the
  session, so the first zone is missing, and it carries no mode at all: it
  predates the recorder reading 0x4022, which on a Prestige is the only
  characteristic holding the selected routine. An unknown mode falls back to an
  even spread over six sectors, which is the same walk Clean makes, so the
  sector derivation is unaffected.

- `fixtures/sonicare-hx6340-kids-complete.jsonl` — a Sonicare for Kids
  (firmware 4.2.2) running a full routine, recorded from before the handle was
  switched on. It closes the first of those gaps and adds three things the
  Prestige cannot show: four sectors instead of six, no `brushing_state` sensor
  at all — the integration does not create one for a Kids handle, so the card
  works from `handle_state` alone — and a session start, where the handle
  reports `run` a moment before it resets its timer, so the previous session's
  120 s is briefly still on the clock.

  It does not close the revisit gap, and cannot: `current_sector` skips the
  mode table entirely for HX63xx, so a Kids handle spreads any mode evenly and
  never revisits.

- `fixtures/sonicare-hx999x-whiteplus-complete.jsonl` — the same Prestige on
  White+, recorded from before switch-on and with the mode captured. This is
  the one the Sonicare branch in the card exists for: a 160 s routine over an
  eight-step visit sequence, so the handle walks all six sectors and then
  returns to two of them. The card has to keep the finished zones marked done
  across that backwards jump, and this fixture is what proves it does.

  It also carries the pressure stream (`--pressure`), about 1600 SensorData
  frames. Nothing reads them yet — the card takes pressure as an entity state,
  not as raw telemetry — but they cost nothing to keep and a future pressure
  test would need exactly this.

Adding a fixture: capture with [`scripts/oralb/adv_capture.py`](../scripts/oralb/),
then keep the frames as hex manufacturer data with their timestamps. Collapsing
consecutive identical advertisements is fine; the brushing time has to keep
advancing, because the card's completion latch reads it.
