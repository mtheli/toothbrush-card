#!/usr/bin/env python3
"""
Oral-B BLE Advertisement Capture
=================================

Purpose
-------
Capture the raw manufacturer-data bytes that an Oral-B toothbrush broadcasts
during a brushing session, to validate/extend the advertisement decoding in
the `Bluetooth-Devices/oralb-ble` Python library (sector byte, pressure/status
byte), to decode the display face, and to diagnose post-session behaviour.

Usage
-----
Start the script, then run a FULL brushing session. Keep the motor running
and spend ~5-10 seconds brushing each sector before moving to the next —
do not pause the brush between sectors, just move it:

    python3 scripts/oralb/adv_capture.py
    python3 scripts/oralb/adv_capture.py --json capture.json
    python3 scripts/oralb/adv_capture.py --mac XX:XX:XX:XX:XX:XX  # lock to one device

Display face / smiley (sector byte, bits 3-5)
---------------------------------------------
The sector byte is not one number: its low three bits carry the quadrant, and
bits 3-5 carry the handle's display face. Upstream masks the upper bits off
("The upper bits are a display flag and are masked off", oralb_ble/parser.py),
so the face is thrown away before Home Assistant ever sees it — which is why
this script decodes it itself.

That split is documented for the older non-iO brushes in
wise86-android/OralBlue_python (Protocol.md, "byte 15: bit 0,1,2: quadrant /
bit 3,4,5: smiley") and it also holds on iO protocol 6 and 8, confirmed
against two donated captures.

Two of the values are known from a handle that was watched while it reported
them (mtheli/toothbrush-card#20): 10 is the star-eyed face, 11 is the
"fireworks" award for cleaning time AND pressure fulfilled. Note those two
came from the GATT characteristic FF0A, which is a full byte, whereas this
3-bit advertisement field can only carry 0-7 — do not assume the two scales
are identical until a session is captured on both at once.

What the captures show so far is that the face the handle settles on at the
end tracks how long the session ran: 51 s -> 0, 74 s -> 3, 123 s (complete)
-> 5. The end-of-run summary therefore prints one row per session with its
duration next to the settled face, which is the measurement this script now
exists to collect. Values 2, 4, 6 and 7 have never been observed; a session
that produces one is worth reporting.

Pressure/status byte
--------------------
A line is printed whenever the pressure/status byte changes, with a bitfield
reading, so button presses and high-pressure events are visible live. To
exercise the bits during a session: hold each button for 1-2 seconds and push
too hard at least once. The power-off press at the end is captured
automatically — the brush keeps advertising for a while after switch-off.
Values unknown to upstream (they surface as "unknown pressure N" sensor
states in Home Assistant) are flagged UNMAPPED.

Post-session phase (issue #4)
-----------------------------
To also diagnose "card clears data shortly after brushing", DO NOT Ctrl+C when
the routine ends. Put the brush down and leave the script running for a few
more minutes. A heartbeat line prints every ~15 s showing the age of the last
advertisement, so you can watch whether the brush keeps emitting idle frames
(brush_time resets to 0 while still advertising) or simply goes silent (offline).
The end-of-run summary prints a post-session timeline with the exact timings.

Output
------
Human-readable live log + optional JSON file that can be attached to a GitHub
issue. The JSON includes the full raw manufacturer_data hex per advertisement,
so nothing is lost if future byte offsets become relevant.

Requirements
------------
    pip install bleak
"""

from __future__ import annotations

import argparse
import asyncio
import json
import signal
import sys
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path

from bleak import BleakScanner
from bleak.backends.scanner import AdvertisementData
from bleak.backends.device import BLEDevice


ORALB_MANUFACTURER_ID = 0x00DC

# The literal SECTOR_MAP oralb_ble shipped up to 1.1.0, before it was replaced
# by a decoder that masks the byte. Every one of these 18 values decomposes
# cleanly into quadrant (low 3 bits) + display face (bits 3-5), which is what
# confirmed the split: e.g. 27 = face 3/quadrant 3, and the five "success"
# bytes are exactly face 5 (41, 42, 43, 47) and face 6 (55).
KNOWN_SECTOR_BYTES = {
    1, 9,
    2, 10,
    3, 11, 19, 27,
    4, 7, 15, 31, 39,
    41, 42, 43, 47, 55,  # "success"
}

# Faces seen in an advertisement so far. Anything outside this set is new and
# worth reporting; see the module docstring for where each one comes from.
KNOWN_SMILEY_VALUES = {0, 1, 3, 5, 6}

# Current upstream PRESSURE mapping (oralb_ble 1.1.1). Values outside this
# set surface as "unknown pressure N" sensor states in Home Assistant.
KNOWN_PRESSURE_BYTES = {
    0, 16, 32, 48, 50, 54, 56, 58,
    80, 82, 86, 90,
    114, 118, 122,
    144, 146, 150, 154,
    178, 182, 186,
    192, 240, 242,
}

# Mirrors the public oralb_ble library's STATES table (oralb_ble/parser.py,
# oralb-ble >= 1.1.3) so our live log matches what the Home Assistant
# integration reports. States not listed here fall back to "unknown_<n>".
STATES = {
    0: "unknown",
    1: "initializing",
    2: "idle",
    3: "running",
    4: "charging",
    5: "setup",
    6: "flight menu",
    8: "selection menu",
    9: "off",
    10: "post brushing statistics",
    113: "final test",
    114: "pcb test",
    115: "sleeping",
    116: "transport",
}


def pressure_flags(value: int) -> str:
    """Bitfield reading of the pressure/status byte, derived from the
    upstream PRESSURE table: bit 7 = high pressure, bit 3 = power button,
    bit 2 = mode button. The remaining bits carry no known meaning."""
    flags = []
    if value & 0x08:
        flags.append("power-btn")
    if value & 0x04:
        flags.append("mode-btn")
    if value & 0x80:
        flags.append("high")
    return "+".join(flags) if flags else "normal"


@dataclass
class Advertisement:
    ts: float
    iso: str
    address: str
    name: str | None
    rssi: int | None
    raw_hex: str
    # Byte offsets per oralb_ble/parser.py:
    #   [0] protocol version, [1] model_type, [3] state,
    #   [4] pressure, [5] minutes, [6] seconds,
    #   [7] mode, [8] sector, [9] sector_timer, [10] number_of_sectors
    model_type: int | None = None
    state: int | None = None
    state_label: str | None = None
    pressure: int | None = None
    brush_time: int | None = None
    mode: int | None = None
    sector: int | None = None
    quadrant: int | None = None
    smiley: int | None = None
    sector_timer: int | None = None
    number_of_sectors: int | None = None
    unknown_sector: bool = False
    unknown_smiley: bool = False
    unknown_pressure: bool = False


def parse_manufacturer(data: bytes) -> dict[str, int | bool | str | None]:
    """Extract fields using the byte offsets from oralb_ble/parser.py."""
    out: dict[str, int | bool | str | None] = {
        "model_type": None, "state": None, "state_label": None,
        "pressure": None, "brush_time": None, "mode": None,
        "sector": None, "quadrant": None, "smiley": None,
        "sector_timer": None, "number_of_sectors": None,
        "unknown_sector": False, "unknown_smiley": False,
        "unknown_pressure": False,
    }
    if len(data) > 1:
        out["model_type"] = data[1]
    if len(data) > 3:
        out["state"] = data[3]
        out["state_label"] = STATES.get(data[3], f"unknown_{data[3]}")
    if len(data) > 4:
        out["pressure"] = data[4]
        out["unknown_pressure"] = data[4] not in KNOWN_PRESSURE_BYTES
    if len(data) > 6:
        out["brush_time"] = data[5] * 60 + data[6]
    if len(data) > 7:
        out["mode"] = data[7]
    if len(data) > 8:
        s = data[8]
        out["sector"] = s
        out["unknown_sector"] = s not in KNOWN_SECTOR_BYTES
        # Low three bits = quadrant (0 none, 7 = "last quadrant" sentinel),
        # bits 3-5 = display face. See the module docstring.
        out["quadrant"] = s & 0x07
        out["smiley"] = (s >> 3) & 0x07
        out["unknown_smiley"] = out["smiley"] not in KNOWN_SMILEY_VALUES
    if len(data) > 9:
        out["sector_timer"] = data[9]
    if len(data) > 10:
        out["number_of_sectors"] = data[10]
    return out


HEARTBEAT_INTERVAL = 15  # seconds between "still listening" lines


class Capture:
    def __init__(self, mac_filter: str | None, json_path: Path | None):
        self.mac_filter = mac_filter.upper() if mac_filter else None
        self.json_path = json_path
        self.records: list[Advertisement] = []
        self.last_record_by_mac: dict[str, Advertisement] = {}
        self.unknown_seen: set[int] = set()
        self.unknown_smiley_seen: set[int] = set()
        self._stop = asyncio.Event()
        self._capture_end: float | None = None

    def _callback(self, device: BLEDevice, adv: AdvertisementData) -> None:
        mfr = adv.manufacturer_data.get(ORALB_MANUFACTURER_ID)
        if not mfr:
            return
        if self.mac_filter and device.address.upper() != self.mac_filter:
            return

        fields = parse_manufacturer(mfr)
        now = time.time()
        record = Advertisement(
            ts=now,
            iso=datetime.fromtimestamp(now, tz=timezone.utc).isoformat(),
            address=device.address,
            name=device.name,
            rssi=adv.rssi,
            raw_hex=mfr.hex(),
            **fields,
        )
        self.records.append(record)

        # Live output: only print on interesting events so the log isn't
        # flooded with duplicates. Issue #3 cares about sector changes; issue #4
        # cares about state transitions and the post-session brush_time reset;
        # the pressure/status byte carries button presses and pressure events;
        # toothbrush-card#20 cares about the display face, whose changes are
        # called out by name so they can be matched against the handle.
        s = record.sector
        p = record.pressure
        prev = self.last_record_by_mac.get(device.address)
        is_new_sector = s is not None and (prev is None or s != prev.sector)
        is_unknown = bool(record.unknown_sector) and s not in self.unknown_seen
        face_changed = record.smiley is not None and (
            prev is None or record.smiley != prev.smiley
        )
        new_face = (
            bool(record.unknown_smiley)
            and record.smiley not in self.unknown_smiley_seen
        )
        state_changed = prev is not None and prev.state != record.state
        pressure_changed = p is not None and (prev is None or p != prev.pressure)
        time_reset = (
            prev is not None
            and prev.brush_time is not None and prev.brush_time > 0
            and record.brush_time == 0
        )

        if (
            is_new_sector or is_unknown or face_changed
            or state_changed or pressure_changed or time_reset
        ):
            events: list[str] = []
            if is_unknown:
                events.append("UNKNOWN — CAPTURE THIS!")
                self.unknown_seen.add(s)  # type: ignore[arg-type]
            if face_changed:
                was = "?" if prev is None or prev.smiley is None else str(prev.smiley)
                events.append(f"face {was}→{record.smiley}")
            if new_face:
                events.append(f"FACE {record.smiley} NEVER SEEN BEFORE — REPORT THIS!")
                self.unknown_smiley_seen.add(record.smiley)  # type: ignore[arg-type]
            if state_changed:
                events.append(f"state {prev.state_label}→{record.state_label}")
            if pressure_changed:
                unmapped = " UNMAPPED!" if record.unknown_pressure else ""
                events.append(f"pressure {p}=0b{p:08b} {pressure_flags(p)}{unmapped}")
            if time_reset:
                events.append("brush_time → 0 (post-session clear)")
            marker = "???" if record.unknown_sector else "   "
            tag = ("  [" + "; ".join(events) + "]") if events else ""
            state_str = f"{record.state}/{record.state_label}" if record.state is not None else "?"
            sector_str = (
                f"0x{s:02X}(q{record.quadrant}/face{record.smiley})"
                if s is not None
                else "?"
            )
            print(
                f"[{time.strftime('%H:%M:%S')}] {marker} {device.address}"
                f"  state={state_str:<12} pressure={record.pressure}"
                f"  time={record.brush_time}s  mode={record.mode}"
                f"  sector={sector_str}"
                f"  timer={record.sector_timer}  N={record.number_of_sectors}"
                f"  raw={record.raw_hex}{tag}"
            )

        self.last_record_by_mac[device.address] = record

    async def run(self) -> None:
        print("=" * 78)
        print("Oral-B BLE Advertisement Capture")
        print("=" * 78)
        if self.mac_filter:
            print(f"Filtering for MAC: {self.mac_filter}")
        else:
            print("Listening to ALL Oral-B devices in range.")
        print("Start a brushing session and keep the motor running through")
        print("every sector, spending ~5-10 seconds in each one. For the")
        print("pressure/status bits: hold each button 1-2 s and push too hard")
        print("once. For the display face, note what the handle actually shows")
        print("at the end and let it keep advertising for a few seconds before")
        print("you stop. Press Ctrl+C once the routine (and post-session) ends.")
        if self.json_path:
            print(f"JSON output: {self.json_path}")
        print("=" * 78)
        print()

        scanner = BleakScanner(detection_callback=self._callback)
        await scanner.start()
        heartbeat = asyncio.ensure_future(self._heartbeat())
        try:
            await self._stop.wait()
        finally:
            heartbeat.cancel()
            await asyncio.gather(heartbeat, return_exceptions=True)
            await scanner.stop()

    async def _heartbeat(self) -> None:
        """Periodic 'still listening' line so the quiet post-session phase
        doesn't look like the script has hung, and so advertising silence
        (brush gone offline) is visible live as a growing 'last advert' age."""
        while not self._stop.is_set():
            try:
                await asyncio.wait_for(self._stop.wait(), timeout=HEARTBEAT_INTERVAL)
            except asyncio.TimeoutError:
                pass
            if self._stop.is_set():
                break
            now = time.time()
            if not self.last_record_by_mac:
                print(f"[{time.strftime('%H:%M:%S')}]  ♥ waiting for first advertisement …")
                continue
            for mac, rec in self.last_record_by_mac.items():
                age = now - rec.ts
                sector_str = f"0x{rec.sector:02X}" if rec.sector is not None else "?"
                silence = "  <— advertising stopped?" if age > HEARTBEAT_INTERVAL else ""
                print(
                    f"[{time.strftime('%H:%M:%S')}]  ♥ {mac}  last advert {age:4.0f}s ago"
                    f"  state={rec.state_label}  time={rec.brush_time}s  sector={sector_str}{silence}"
                )

    def stop(self) -> None:
        self._capture_end = time.time()
        self._stop.set()

    def summarise(self) -> None:
        print()
        print("=" * 78)
        print("Summary")
        print("=" * 78)
        print(f"Total advertisements captured: {len(self.records)}")
        if not self.records:
            return

        # Per-device summary
        by_mac: dict[str, list[Advertisement]] = {}
        for r in self.records:
            by_mac.setdefault(r.address, []).append(r)

        for mac, recs in by_mac.items():
            name = next((r.name for r in recs if r.name), None) or "?"
            n_values = sorted({r.number_of_sectors for r in recs if r.number_of_sectors is not None})
            print(f"\n{mac}  ({name})   — {len(recs)} adverts")
            print(f"  number_of_sectors values seen: {n_values}")
            # Count each distinct sector byte
            by_sector: dict[int, int] = {}
            unknown: set[int] = set()
            for r in recs:
                if r.sector is None:
                    continue
                by_sector[r.sector] = by_sector.get(r.sector, 0) + 1
                if r.unknown_sector:
                    unknown.add(r.sector)
            print("  sector byte → count (quadrant = low 3 bits, face = bits 3-5):")
            for s in sorted(by_sector):
                tag = "  <— UNKNOWN" if s in unknown else ""
                if (s >> 3) & 0x07 not in KNOWN_SMILEY_VALUES:
                    tag += "  <— NEW FACE, REPORT THIS"
                print(
                    f"    0x{s:02X} ({s:>3}): {by_sector[s]:>4}"
                    f"   quadrant={s & 0x07}  face={(s >> 3) & 0x07}{tag}"
                )

            # Count each distinct pressure/status byte
            by_pressure: dict[int, int] = {}
            unmapped: set[int] = set()
            for r in recs:
                if r.pressure is None:
                    continue
                by_pressure[r.pressure] = by_pressure.get(r.pressure, 0) + 1
                if r.unknown_pressure:
                    unmapped.add(r.pressure)
            print("  pressure byte → count (bits, flags):")
            for p in sorted(by_pressure):
                tag = "  <— UNMAPPED UPSTREAM" if p in unmapped else ""
                print(
                    f"    {p:>3} 0b{p:08b} ({pressure_flags(p)}):"
                    f" {by_pressure[p]:>4}{tag}"
                )

            self._print_face_sessions(recs)
            self._print_post_session_timeline(recs)

        # Save JSON if requested
        if self.json_path:
            payload = {
                "generated_at": datetime.now(tz=timezone.utc).isoformat(),
                "oralb_ble_version_reference": "1.1.1",
                "known_sector_bytes": sorted(KNOWN_SECTOR_BYTES),
                "known_smiley_values": sorted(KNOWN_SMILEY_VALUES),
                "known_pressure_bytes": sorted(KNOWN_PRESSURE_BYTES),
                "advertisements": [asdict(r) for r in self.records],
            }
            self.json_path.write_text(json.dumps(payload, indent=2))
            print(f"\nWrote {len(self.records)} records to {self.json_path}")
            print("→ For sector/pressure decoding, attach this file at")
            print("  https://github.com/Bluetooth-Devices/oralb-ble/issues")
            print("→ For display faces, attach it plus what the handle showed at")
            print("  https://github.com/mtheli/toothbrush-card/issues/20")

    @staticmethod
    def _split_sessions(recs: list[Advertisement]) -> list[list[Advertisement]]:
        """Group adverts into sessions by the brushing timer.

        A session runs from the first frame with a non-zero timer to the last
        one before it resets. The settled face matters more than the frames
        during brushing, and it arrives *after* the motor stops but *before*
        the timer clears — the handle keeps reporting the final duration while
        it shows the summary — so the timer, not the state, delimits a session.
        """
        sessions: list[list[Advertisement]] = []
        current: list[Advertisement] = []
        for r in recs:
            if r.brush_time:
                current.append(r)
            elif current:
                sessions.append(current)
                current = []
        if current:
            sessions.append(current)
        return sessions

    def _print_face_sessions(self, recs: list[Advertisement]) -> None:
        """One row per session: how long it ran, next to the face the handle
        settled on. Collecting these rows is the point of the face decoding —
        the three donated captures so far read 51 s → 0, 74 s → 3 and
        123 s → 5, and every further row either supports that or breaks it."""
        sessions = self._split_sessions(recs)
        print("\n  Display face per session:")
        if not sessions:
            print("    no session seen (the brushing timer never left 0)")
            return

        print("    #  started   duration  face(s) while running  settled face")
        for i, session in enumerate(sessions, start=1):
            duration = max((r.brush_time or 0) for r in session)
            during = sorted(
                {r.smiley for r in session
                 if r.state_label == "running" and r.smiley is not None}
            )
            settled = next(
                (r.smiley for r in reversed(session)
                 if r.state_label != "running" and r.smiley is not None),
                session[-1].smiley,
            )
            started = time.strftime("%H:%M:%S", time.localtime(session[0].ts))
            during_str = ", ".join(str(f) for f in during) or "-"
            tag = ""
            if settled is not None and settled not in KNOWN_SMILEY_VALUES:
                tag = "  <— NEW, REPORT THIS"
            print(
                f"    {i:>2}  {started}  {duration:>6}s  {during_str:>21}"
                f"  {settled if settled is not None else '?':>12}{tag}"
            )
        print("    (a session with no post-brushing frames reports its last")
        print("     running face instead — leave the brush advertising to avoid that)")

    def _print_post_session_timeline(self, recs: list[Advertisement]) -> None:
        """Issue #4: after the last 'running' advert, when does the brush clear
        brushing_time/sector, and does it keep advertising idle frames or go
        silent (offline)? All timings are relative to the last running advert."""
        running = [r for r in recs if r.state_label == "running"]
        print("\n  Post-session timeline (issue #4):")
        if not running:
            print("    no 'running' advertisements seen — was the motor on?")
            return

        last_run = running[-1]
        last_run_iso = time.strftime("%H:%M:%S", time.localtime(last_run.ts))
        print(
            f"    last 'running' advert at {last_run_iso}"
            f"  (time={last_run.brush_time}s, sector=0x{last_run.sector:02X})"
            if last_run.sector is not None
            else f"    last 'running' advert at {last_run_iso}  (time={last_run.brush_time}s)"
        )

        post = [r for r in recs if r.ts > last_run.ts]
        if not post:
            print("    no advertisements after the last running frame — brush went")
            print("    silent immediately (likely offline within a frame or two).")
            return

        first_zero = next((r for r in post if r.brush_time == 0), None)
        if first_zero is not None:
            dt = first_zero.ts - last_run.ts
            sec = f"0x{first_zero.sector:02X}" if first_zero.sector is not None else "?"
            print(
                f"    brush_time first hit 0 at +{dt:.0f}s"
                f"  (state={first_zero.state_label}, sector={sec})"
                f"  → idle frame, NOT offline"
            )
        else:
            print("    brush_time never reset to 0 in the captured window")

        last = post[-1]
        gap = (self._capture_end or time.time()) - last.ts
        last_iso = time.strftime("%H:%M:%S", time.localtime(last.ts))
        total_idle = last.ts - last_run.ts
        print(
            f"    last advert overall at {last_iso}"
            f"  ({total_idle:.0f}s after session end)"
        )
        if gap > 2 * HEARTBEAT_INTERVAL:
            print(
                f"    then SILENCE for {gap:.0f}s until capture stopped"
                f"  → brush stopped advertising (went offline)"
            )
        else:
            print(
                f"    still advertising when capture stopped ({gap:.0f}s gap)"
                f"  → run longer to see the brush go offline"
            )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[1])
    parser.add_argument("--mac", help="Only capture adverts from this MAC")
    parser.add_argument(
        "--json",
        type=Path,
        help="Write full capture to this JSON file (recommended for bug reports)",
    )
    args = parser.parse_args()

    capture = Capture(mac_filter=args.mac, json_path=args.json)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    def _sigint(_sig, _frm):
        capture.stop()

    signal.signal(signal.SIGINT, _sigint)
    signal.signal(signal.SIGTERM, _sigint)

    try:
        loop.run_until_complete(capture.run())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    finally:
        capture.summarise()
    return 0


if __name__ == "__main__":
    sys.exit(main())
