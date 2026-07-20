# Oral-B BLE Advertisement Capture

`adv_capture.py` is a small diagnostic tool that passively records the raw
manufacturer-data bytes an Oral-B toothbrush broadcasts during a brushing
session. It never connects or pairs with the brush — it only listens.
Captures like these are used to validate and extend the advertisement
decoding in the upstream [`oralb-ble`](https://github.com/Bluetooth-Devices/oralb-ble)
library (sector byte, pressure/status byte, post-session behaviour).

## Requirements

Any computer with Bluetooth — a Linux/macOS/Windows laptop or a Raspberry Pi
works fine. The Home Assistant OS SSH terminal does **not** work (locked-down
Python, no `pip`).

```bash
pip install bleak
python3 adv_capture.py --json capture.json
```

Use `--mac XX:XX:XX:XX:XX:XX` to lock onto one device if several Oral-B
brushes are in range.

## Running a capture session

1. Start the script, then start the brush.
2. Run a **full** session: keep the motor running the whole time and spend
   ~5–10 seconds per sector — move between sectors without pausing.
3. After the session ends, leave the script running for another minute or
   two — the brush keeps advertising for a while and the post-session frames
   are valuable.
4. Stop with `Ctrl+C` and attach the JSON file to the relevant issue.

**Privacy note:** the JSON file contains your brush's Bluetooth MAC address
(needed to correlate frames). If you prefer not to share it, search & replace
the address with a placeholder before uploading — the payload bytes are what
matters.

## No suitable computer at hand?

The same data can be captured from within Home Assistant: add

```yaml
logger:
  logs:
    oralb_ble: debug
```

to `configuration.yaml`, restart, run a brushing session, then grab the
`Parsing Oral-B sensor: bytearray(...)` lines from the full log
(Settings → System → Logs → "Download Full Log").
