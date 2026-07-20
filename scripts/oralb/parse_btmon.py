#!/usr/bin/env python3
"""
Parse an Oral-B BLE session from a btmon capture.

Why btmon
---------
The regular passive scanner (``adv_capture.py``) receives advertisements
through BlueZ, which de-duplicates and rate-limits them. Short-lived states
-- most notably the post-brushing summary state (byte 3 == 10), which the
handle only shows for a moment before dropping to idle/charge -- can be
dropped before they ever reach the scanner. ``btmon`` taps the HCI transport
*below* BlueZ, so it sees every LE Advertising Report the controller reports.

Usage
-----
Capture a session while btmon records to a file (needs root for the HCI tap)::

    sudo btmon -w io_session.btsnoop

Run a full session in another terminal: brush, then either stop early with the
power button or set the handle on its charger, and keep btmon running for a
minute or two afterwards. Stop btmon with Ctrl+C, then::

    python3 scripts/oralb/parse_btmon.py io_session.btsnoop

The parser walks the btsnoop file, extracts the Oral-B manufacturer payload
from every advertisement, and prints a state/pressure/sector timeline. Any
advertisement whose device-state byte is not in the known set is flagged, so a
summary-state (10) frame -- if the capture caught one -- stands out.
"""

from __future__ import annotations

import struct
import sys

ORALB_COMPANY = 0x00DC  # manufacturer id in the AD manufacturer-specific field

# btmon writes the "monitor" btsnoop variant; opcode 0x0003 is a received HCI
# event packet. We only care about LE Meta -> LE Advertising Report events.
BTSNOOP_MAGIC = b"btsnoop\x00"
OPCODE_EVENT = 0x0003
HCI_EVENT_LE_META = 0x3E
LE_SUBEVENT_ADV_REPORT = 0x02  # legacy advertising report
LE_SUBEVENT_EXT_ADV_REPORT = 0x0D  # extended advertising report (modern controllers)

STATES = {
    0: "unknown",
    1: "init",
    2: "idle",
    3: "running",
    4: "charge",
    5: "setup",
    6: "flight menu",
    7: "charge forbidden",
    8: "pre-run",
    9: "pause",
    10: "POST-BRUSHING SUMMARY",  # the state we are hunting for
    113: "final test",
    114: "pcb test",
    115: "sleep",
    116: "transport",
}


def _decode_pressure(p: int) -> str:
    if p & 0x08:
        return "power-btn"
    if p & 0x04:
        return "mode-btn"
    if p & 0x80:
        return "high"
    return "normal"


def _iter_adv_payloads(path):
    """Yield (timestamp_us, addr_str, oralb_payload) for each Oral-B advert."""
    with open(path, "rb") as fh:
        magic = fh.read(8)
        if magic != BTSNOOP_MAGIC:
            raise SystemExit(f"{path}: not a btsnoop file (bad magic {magic!r})")
        # version (u32 BE), datalink (u32 BE) -- datalink 2001 == monitor
        fh.read(8)
        while True:
            header = fh.read(24)
            if len(header) < 24:
                return
            _orig_len, incl_len, flags, _drops, ts = struct.unpack(">IIIIq", header)
            packet = fh.read(incl_len)
            if len(packet) < incl_len:
                return
            opcode = flags & 0xFFFF
            if opcode != OPCODE_EVENT:
                continue
            yield from _parse_event(ts, packet)


def _parse_event(ts, packet):
    if len(packet) < 4 or packet[0] != HCI_EVENT_LE_META:
        return
    # packet: event_code(1) param_len(1) subevent(1) num_reports(1) reports...
    subevent = packet[2]
    num_reports = packet[3]
    if subevent == LE_SUBEVENT_ADV_REPORT:
        reports = _legacy_reports(packet, num_reports)
    elif subevent == LE_SUBEVENT_EXT_ADV_REPORT:
        reports = _extended_reports(packet, num_reports)
    else:
        return
    for addr, data in reports:
        payload = _oralb_payload(data)
        if payload is not None:
            addr_str = ":".join(f"{b:02X}" for b in reversed(addr))
            yield ts, addr_str, payload


def _legacy_reports(packet, num_reports):
    # event_type(1) addr_type(1) addr(6) data_len(1) data(data_len);
    # one rssi byte per report follows all reports (unused here).
    pos = 4
    out = []
    for _ in range(num_reports):
        if pos + 9 > len(packet):
            break
        addr = packet[pos + 2 : pos + 8]
        data_len = packet[pos + 8]
        out.append((addr, packet[pos + 9 : pos + 9 + data_len]))
        pos += 9 + data_len
    return out


def _extended_reports(packet, num_reports):
    # event_type(2) addr_type(1) addr(6) primary_phy(1) secondary_phy(1)
    # sid(1) tx_power(1) rssi(1) periodic_interval(2) direct_addr_type(1)
    # direct_addr(6) data_len(1) data(data_len). rssi is inline per report.
    pos = 4
    out = []
    for _ in range(num_reports):
        if pos + 24 > len(packet):
            break
        addr = packet[pos + 3 : pos + 9]
        data_len = packet[pos + 23]
        data = packet[pos + 24 : pos + 24 + data_len]
        out.append((addr, data))
        pos += 24 + data_len
    return out


def _oralb_payload(ad_data: bytes):
    """Return the Oral-B manufacturer payload from an AD structure blob."""
    i = 0
    while i + 1 < len(ad_data):
        length = ad_data[i]
        if length == 0:
            break
        ad_type = ad_data[i + 1]
        value = ad_data[i + 2 : i + 1 + length]
        if ad_type == 0xFF and len(value) >= 2:
            company = value[0] | (value[1] << 8)
            if company == ORALB_COMPANY:
                return value[2:]
        i += 1 + length
    return None


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: parse_btmon.py <btmon-capture.btsnoop>")
    path = sys.argv[1]

    last_key = None
    total = 0
    states_seen = {}
    summary_hits = []
    t0 = None

    print(f"{'time':>10}  {'state':<22} {'pressure':<14} {'sector':<10} model")
    print("-" * 72)
    for ts, addr, payload in _iter_adv_payloads(path):
        if len(payload) < 9:
            continue
        total += 1
        if t0 is None:
            t0 = ts
        model = payload[1]
        state = payload[3]
        pressure = payload[4]
        sector = payload[8]
        states_seen[state] = states_seen.get(state, 0) + 1

        # Collapse identical consecutive frames to keep the timeline readable.
        key = (state, pressure, sector)
        if key == last_key:
            continue
        last_key = key

        rel = (ts - t0) / 1_000_000
        state_label = STATES.get(state, f"UNKNOWN {state}")
        flag = "  <== !!" if state not in STATES else ""
        if state == 10:
            summary_hits.append(rel)
        print(
            f"{rel:9.1f}s  {state_label:<22} "
            f"{pressure:>3} ({_decode_pressure(pressure):<9}) "
            f"0x{sector:02X}({sector:<3})  0x{model:02X}{flag}"
        )

    print("-" * 72)
    print(f"Oral-B advertisements: {total}")
    print("states seen:", {STATES.get(s, s): n for s, n in sorted(states_seen.items())})
    if summary_hits:
        print(f"\n*** POST-BRUSHING SUMMARY (state 10) captured {len(summary_hits)}x ***")
    else:
        print("\nNo state-10 frame in this capture.")


if __name__ == "__main__":
    main()
