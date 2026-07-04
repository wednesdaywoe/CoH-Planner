"""Regression guard for the special-attrib byte-granular sub-index decode.

Attrib indices 117-128 (raw u4 values 468-515) are NOT plain `index * 4`
attribs — the engine packs several distinct "special" attribs into each index
and discriminates them with the low 2 bits (`raw % 4`). The parser historically
did `ATTRIB_NAME[raw // 4]`, which truncated those bits and collapsed 2-4
unrelated attribs into one (the "attrib-118 misdecode": kXPDebtProtection /
kSetMode / kSetCostume all landing on `Set_Mode`). `resolve_attrib` fixes this
by keying the raw value directly. See HOMECOMING_PARSER.md.

This is a pure-function test (no .bin / .pigg needed). Run directly:
    python3 tools/bin-crawler/tests/test_special_attribs.py
or under pytest if it's ever installed (functions are named test_*).
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.parser._enums import (  # noqa: E402
    ATTRIB_NAME,
    SPECIAL_ATTRIB_BY_RAW,
    SPECIAL_ATTRIB_MAX,
    SPECIAL_ATTRIB_MIN,
    resolve_attrib,
)


def test_attrib_118_three_way_split():
    """The motivating bug: index 118 (raw 472/473/474) is three distinct attribs,
    not one. `raw // 4` used to label all three `Set_Mode`."""
    assert resolve_attrib(472) == "XPDebtProtection"  # was Set_Mode (Empathy/Resurrect)
    assert resolve_attrib(473) == "Set_Mode"          # the genuine mode set
    assert resolve_attrib(474) == "Set_Costume"       # was Set_Mode (Granite RockSuit)


def test_grant_vs_revoke_not_conflated():
    """Index 120: raw 481 grants a power, raw 482 REVOKES one — opposites that
    both used to decode as `Grant_Power`."""
    assert resolve_attrib(481) == "Grant_Power"
    assert resolve_attrib(482) == "Revoke_Power"


def test_index_117_siblings_split():
    """Index 117: Create_Entity is only the +1 slot; the others are unrelated."""
    assert resolve_attrib(468) == "Translucency"
    assert resolve_attrib(469) == "Create_Entity"
    assert resolve_attrib(470) == "Clear_Damagers"
    assert resolve_attrib(471) == "Silent_Kill"


def test_cancel_and_execute():
    assert resolve_attrib(511) == "Cancel_Mods"   # was mislabeled Cancel_Effects
    assert resolve_attrib(512) == "Execute_Power"


def test_normal_region_unchanged():
    """4-aligned attribs outside the special window still resolve via `raw // 4`."""
    assert resolve_attrib(0) == "Smashing_Dmg"        # index 0
    assert resolve_attrib(90 * 4) == "RechargeTime"   # index 90
    assert resolve_attrib(67 * 4) == "Held"           # index 67
    # An unmapped NORMAL index falls back to Unknown(<index>), not Special().
    assert resolve_attrib(200 * 4) == "Unknown(200)"


def test_unmapped_special_is_honest():
    """A raw value in the special window with no known name becomes Special(<raw>)
    — it must NOT borrow the collapsed-index sibling's (wrong) name."""
    # 485 (index 121 +1) has no oracle name; index 121 +0 is Global_Chance_Mod.
    assert resolve_attrib(485) == "Special(485)"
    assert resolve_attrib(485) != "Global_Chance_Mod"


def test_map_invariants():
    """Every mapped raw value sits inside the declared special window, and no
    special value is 4-aligned onto a real normal index by accident."""
    for raw, name in SPECIAL_ATTRIB_BY_RAW.items():
        assert SPECIAL_ATTRIB_MIN <= raw <= SPECIAL_ATTRIB_MAX, (raw, name)
        assert name and not name.startswith("Special(")
    # The special window covers exactly collapsed indices 117..128.
    assert SPECIAL_ATTRIB_MIN == 117 * 4
    assert SPECIAL_ATTRIB_MAX == 128 * 4 + 3
    # ATTRIB_NAME still carries the legacy collapsed entries (kept for reference)
    # but they are NOT what resolve_attrib returns for the special window.
    assert ATTRIB_NAME.get(118) == "Set_Mode"
    assert resolve_attrib(472) != ATTRIB_NAME.get(118)


def _run():
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failed = 0
    for fn in fns:
        try:
            fn()
            print(f"PASS {fn.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"FAIL {fn.__name__}: {e}")
    if failed:
        print(f"\n{failed}/{len(fns)} failed")
        sys.exit(1)
    print(f"\nall {len(fns)} passed")


if __name__ == "__main__":
    _run()
