"""Structural tests for the schedules.bin / exemplar_handicaps.bin parsers.

Layout oracle: ParseSchedules/ParseSchedule (power_system.c) and
ParseBoostExemplarTable (boost.h) in the released CoH server source; see
_schedules.py. These tests run on synthetic Parse7 blobs (no .bin/.pigg
needed) and pin both the happy-path decode and the fail-loud paths — a
misaligned read must raise, never ship a truncated or garbage schedule.

Run directly:
    python3 tools/bin-crawler/tests/test_schedules.py
or under pytest if it's ever installed (functions are named test_*).
"""

import os
import struct
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.parser._schedules import (  # noqa: E402
    parse_exemplar_handicaps,
    parse_schedules,
)


def _parse7_blob(payload: bytes) -> bytes:
    """Wrap a data-block payload in a minimal Parse7 container: CrypticS
    magic + CRC + "Parse7" format string + empty string table + block size."""
    header = b"CrypticS" + b"\0\0\0\0" + struct.pack("<H", 6) + b"Parse7"
    empty_string_table = struct.pack("<I", 0)
    return header + empty_string_table + struct.pack("<I", len(payload)) + payload


def _u4_array(values) -> bytes:
    return struct.pack("<I", len(values)) + b"".join(
        struct.pack("<I", v) for v in values)


def _f4_array(values) -> bytes:
    return struct.pack("<I", len(values)) + b"".join(
        struct.pack("<f", v) for v in values)


def _schedules_blob(arrays) -> bytes:
    """Build a schedules.bin data block: one size-prefixed embedded Schedule
    struct holding the seven int arrays in parse-table order."""
    schedule = b"".join(_u4_array(a) for a in arrays)
    return _parse7_blob(struct.pack("<I", len(schedule)) + schedule)


# The HC live shapes, used as the round-trip fixture.
_HC_ARRAYS = [
    [0],                                   # FreeBoostSlotsOnPower
    [3, 5, 7, 9],                          # PoolPowerSet
    [34],                                  # EpicPowerSet
    [0, 0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23,
     25, 27, 29, 31, 34, 37, 40, 43, 46, 48],  # Power
    [2, 2, 4, 4, 6, 6],                    # AssignableBoost (truncated)
    [0, 0, 0, 1, 9],                       # InspirationCol
    [0, 2, 24, 39],                        # InspirationRow
]


def test_schedules_round_trip():
    schedule = parse_schedules(_schedules_blob(_HC_ARRAYS))
    assert schedule.free_boost_slots_on_power == _HC_ARRAYS[0]
    assert schedule.pool_power_set == _HC_ARRAYS[1]
    assert schedule.epic_power_set == _HC_ARRAYS[2]
    assert schedule.power == _HC_ARRAYS[3]
    assert schedule.assignable_boost == _HC_ARRAYS[4]
    assert schedule.inspiration_column == _HC_ARRAYS[5]
    assert schedule.inspiration_row == _HC_ARRAYS[6]


def test_schedules_trailing_bytes_raise():
    schedule = b"".join(_u4_array(a) for a in _HC_ARRAYS)
    blob = _parse7_blob(struct.pack("<I", len(schedule)) + schedule + b"\0\0\0\0")
    try:
        parse_schedules(blob)
    except ValueError as e:
        assert "trailing" in str(e)
    else:
        raise AssertionError("trailing bytes did not raise")


def test_schedules_unsorted_levels_raise():
    """CountForLevel counts a sorted prefix; an unsorted array is a
    misalignment signal, not data."""
    arrays = [a[:] for a in _HC_ARRAYS]
    arrays[3] = [5, 3, 1]
    try:
        parse_schedules(_schedules_blob(arrays))
    except ValueError as e:
        assert "sorted" in str(e)
    else:
        raise AssertionError("unsorted schedule did not raise")


def test_schedules_implausible_level_raises():
    arrays = [a[:] for a in _HC_ARRAYS]
    arrays[1] = [3, 5, 100000]
    try:
        parse_schedules(_schedules_blob(arrays))
    except ValueError as e:
        assert "implausible" in str(e)
    else:
        raise AssertionError("implausible level did not raise")


def test_schedules_empty_power_schedule_raises():
    arrays = [a[:] for a in _HC_ARRAYS]
    arrays[3] = []
    try:
        parse_schedules(_schedules_blob(arrays))
    except ValueError as e:
        assert "Power" in str(e)
    else:
        raise AssertionError("empty Power schedule did not raise")


def _exemplar_blob(limits, handicaps, pre_clamp, post_clamp) -> bytes:
    payload = (_f4_array(limits) + _f4_array(handicaps)
               + _f4_array(pre_clamp) + _f4_array(post_clamp))
    return _parse7_blob(payload)


def test_exemplar_round_trip():
    curves = parse_exemplar_handicaps(_exemplar_blob(
        [0.05, 0.05, 0.1], [0.022, 0.045, 0.068], [0.4167], [1.0]))
    assert [round(v, 4) for v in curves.limits] == [0.05, 0.05, 0.1]
    assert [round(v, 4) for v in curves.handicaps] == [0.022, 0.045, 0.068]
    assert [round(v, 4) for v in curves.pre_clamp] == [0.4167]
    assert [round(v, 4) for v in curves.post_clamp] == [1.0]


def test_exemplar_trailing_bytes_raise():
    payload = (_f4_array([0.05]) + _f4_array([0.022])
               + _f4_array([0.4167]) + _f4_array([1.0]) + b"\0\0\0\0")
    try:
        parse_exemplar_handicaps(_parse7_blob(payload))
    except ValueError as e:
        assert "trailing" in str(e)
    else:
        raise AssertionError("trailing bytes did not raise")


def test_exemplar_empty_curves_raise():
    """The engine tolerates empty Limits/Weights (clamp becomes a no-op) but
    no shipped dataset does that — treat it as a misalignment signal."""
    try:
        parse_exemplar_handicaps(_exemplar_blob([], [], [], []))
    except ValueError as e:
        assert "empty" in str(e)
    else:
        raise AssertionError("empty curves did not raise")


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            try:
                fn()
                print(f"PASS {name}")
            except AssertionError as e:
                failures += 1
                print(f"FAIL {name}: {e}")
    sys.exit(1 if failures else 0)
