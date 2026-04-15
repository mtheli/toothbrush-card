#!/usr/bin/env python3
"""
Oral-B BLE Advertisement Capture
=================================

Purpose
-------
Capture the raw manufacturer-data bytes that an Oral-B IO toothbrush broadcasts
during a brushing session, so we can build a complete SECTOR_MAP for the
`Bluetooth-Devices/oralb-ble` Python library.

The library currently only decodes sectors 1-4; brushes reporting 6 sectors
(e.g. IO Series 10) emit unknown byte values for sectors 5 and 6.

Usage
-----
Start the script, then run a FULL brushing session. Keep the motor running
and spend ~5-10 seconds brushing each sector before moving to the next —
do not pause the brush between sectors, just move it:

    python3 oralb_sector_capture.py
    python3 oralb_sector_capture.py --json oralb_capture.json
    python3 oralb_sector_capture.py --mac XX:XX:XX:XX:XX:XX  # lock to one device

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

# Current upstream mapping (oralb_ble 1.1.0). Anything not in here is
# interesting and what we want to capture.
KNOWN_SECTOR_BYTES = {
    1, 9,
    2, 10,
    3, 11, 19, 27,
    4, 7, 15, 31, 39,
    41, 42, 43, 47, 55,  # "success"
}

STATES = {2: "idle", 3: "running"}


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
    sector_timer: int | None = None
    number_of_sectors: int | None = None
    unknown_sector: bool = False


def parse_manufacturer(data: bytes) -> dict[str, int | bool | str | None]:
    """Extract fields using the byte offsets from oralb_ble/parser.py."""
    out: dict[str, int | bool | str | None] = {
        "model_type": None, "state": None, "state_label": None,
        "pressure": None, "brush_time": None, "mode": None,
        "sector": None, "sector_timer": None, "number_of_sectors": None,
        "unknown_sector": False,
    }
    if len(data) > 1:
        out["model_type"] = data[1]
    if len(data) > 3:
        out["state"] = data[3]
        out["state_label"] = STATES.get(data[3], f"unknown_{data[3]}")
    if len(data) > 4:
        out["pressure"] = data[4]
    if len(data) > 6:
        out["brush_time"] = data[5] * 60 + data[6]
    if len(data) > 7:
        out["mode"] = data[7]
    if len(data) > 8:
        s = data[8]
        out["sector"] = s
        out["unknown_sector"] = s not in KNOWN_SECTOR_BYTES
    if len(data) > 9:
        out["sector_timer"] = data[9]
    if len(data) > 10:
        out["number_of_sectors"] = data[10]
    return out


class Capture:
    def __init__(self, mac_filter: str | None, json_path: Path | None):
        self.mac_filter = mac_filter.upper() if mac_filter else None
        self.json_path = json_path
        self.records: list[Advertisement] = []
        self.last_sector_by_mac: dict[str, int | None] = {}
        self.unknown_seen: set[int] = set()
        self._stop = asyncio.Event()

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

        # Live output: only print on interesting events so smartmatic's log
        # isn't flooded with duplicates.
        s = record.sector
        prev = self.last_sector_by_mac.get(device.address)
        is_new_sector = s is not None and s != prev
        is_unknown = bool(record.unknown_sector) and s not in self.unknown_seen

        if is_new_sector or is_unknown:
            marker = "???" if record.unknown_sector else "   "
            tag = ""
            if record.unknown_sector:
                tag = " [UNKNOWN — CAPTURE THIS!]"
                self.unknown_seen.add(s)  # type: ignore[arg-type]
            state_str = f"{record.state}/{record.state_label}" if record.state is not None else "?"
            print(
                f"[{time.strftime('%H:%M:%S')}] {marker} {device.address}"
                f"  state={state_str:<12} pressure={record.pressure}"
                f"  time={record.brush_time}s  mode={record.mode}"
                f"  sector=0x{s:02X}({s})"
                f"  timer={record.sector_timer}  N={record.number_of_sectors}"
                f"  raw={record.raw_hex}{tag}"
            )
            self.last_sector_by_mac[device.address] = s

    async def run(self) -> None:
        print("=" * 78)
        print("Oral-B BLE Sector Capture")
        print("=" * 78)
        if self.mac_filter:
            print(f"Filtering for MAC: {self.mac_filter}")
        else:
            print("Listening to ALL Oral-B devices in range.")
        print("Start a brushing session and keep the motor running through")
        print("every sector, spending ~5-10 seconds in each one. Press Ctrl+C")
        print("once the routine ends.")
        if self.json_path:
            print(f"JSON output: {self.json_path}")
        print("=" * 78)
        print()

        scanner = BleakScanner(detection_callback=self._callback)
        await scanner.start()
        try:
            await self._stop.wait()
        finally:
            await scanner.stop()

    def stop(self) -> None:
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
            print("  sector byte → count (hex, dec):")
            for s in sorted(by_sector):
                tag = "  <— UNKNOWN" if s in unknown else ""
                print(f"    0x{s:02X} ({s:>3}): {by_sector[s]:>4}{tag}")

        # Save JSON if requested
        if self.json_path:
            payload = {
                "generated_at": datetime.now(tz=timezone.utc).isoformat(),
                "oralb_ble_version_reference": "1.1.0",
                "known_sector_bytes": sorted(KNOWN_SECTOR_BYTES),
                "advertisements": [asdict(r) for r in self.records],
            }
            self.json_path.write_text(json.dumps(payload, indent=2))
            print(f"\nWrote {len(self.records)} records to {self.json_path}")
            print("→ Attach this file to a GitHub issue at")
            print("  https://github.com/Bluetooth-Devices/oralb-ble/issues")


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
