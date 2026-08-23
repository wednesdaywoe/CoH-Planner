"""Regression guard for the DetailRecipe record layout (baserecipes.bin).

The shipped bins are newer than the released source's parse table, and the
drift was mapped empirically (`_recipes.py` module doc): `Reward` is a single
string rather than the snapshot's array, Homecoming carries a sixth reward
slot and two extra display strings, and the reward-slot ORDER differs from the
snapshot (power before incarnate, the stock RecipeReward position empty). A
future insertion by any fork would shift every later field, so the guard is
the same two-sided one boostsets carries:

  - **The layout, on bytes built here.** Both shipped layouts round-trip on
    synthesized records, the schema detector picks each by trial parse, and a
    trailing byte refuses to parse — byte-accounting is what turns the next
    fork insertion into a loud stop instead of a silent shift.
  - **The committed export, as a census.** Only the real records can show the
    decode lands meaningful values: every craft recipe names an
    `Incarnate.`-prefixed reward, every salvage link is an `S_` item, and the
    Homecoming corpus states exactly the three known crafting families.

Reads committed JSON — no .bin / .pigg needed (the layout half builds its own
bytes).

Run directly:  python3 tools/bin-crawler/tests/test_recipes_record_layout.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os
import struct
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.parser._recipes import _detect_schema, _parse_record  # noqa: E402
from bin_crawler.parser._reader import Parse6BinReader  # noqa: E402

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

_FORK_DIR = _forks.FORK_SUBDIR


# ---------------------------------------------------------------------------
# An encoder — the reader's rules, written the other way round. Inline pascal
# strings throughout (the Parse6 container's spelling; the layout under test is
# the FIELD ORDER, which both containers share).
# ---------------------------------------------------------------------------

def _u4(n):
    return struct.pack("<I", n)


def _string(s, pos):
    """u16 length, the bytes, then padding to the next 4-byte boundary."""
    out = struct.pack("<H", len(s)) + s.encode("ascii")
    end = pos + len(out)
    return out + b"\x00" * ((4 - end % 4) % 4)


def _record(*, hc_schema, salvage=(), powers=(), incarnate_reward="",
            contact_reward="", requires=(), rarity=1, level=0,
            creation_cost=(), trailing=b""):
    buf = b""

    def put_str(s):
        nonlocal buf
        buf += _string(s, len(buf))

    def put_str_array(items):
        nonlocal buf
        buf += _u4(len(items))
        for s in items:
            put_str(s)

    def put_components(items):
        nonlocal buf
        buf += _u4(len(items))
        for amount, name in items:
            inner = _u4(amount) + _string(name, 4)
            buf += _u4(len(inner)) + inner

    put_str("DEFS/INVENTION/INCARNATE.RECIPE")   # SourceFile
    put_str("Vigor_Boost_Recipe")                # Name
    put_str("P100")                              # DisplayName
    put_str("P200")                              # DisplayHelp
    put_str("")                                  # DisplayShortHelp
    put_str("icon.tga")                          # Icon
    put_str("P300")                              # DisplayTabName
    put_str("")                                  # DetailIcon link
    put_str_array(["Worktable_Incarnate"])       # Workshops
    put_components(salvage)
    put_components(powers)
    put_str_array([])                            # AdditionalComponents
    put_str("")                                  # Detail link
    if hc_schema:
        for value in ("", "", "", incarnate_reward, "", contact_reward):
            put_str(value)                       # invent/enh/power/incarnate/slot5/contact
    else:
        for value in ("", "", "", "", incarnate_reward):
            put_str(value)                       # invent/enh/recipe/power/incarnate
    put_str_array(requires)                      # VisibleRequires
    buf += _u4(rarity) + _u4(level) + _u4(0) + _u4(0)   # rarity, level, min, max
    put_str_array(creation_cost)
    for value in (100, 0, 1, 0, 1, 0, 0, 0, 0):  # sell..maxinv, creates ×4
        buf += _u4(value)
    for _ in range(4):                           # the four requires arrays
        put_str_array([])
    for _ in range(7 if hc_schema else 5):       # display strings
        put_str("")
    buf += _u4(3)                                # flags
    return buf + trailing


def _parse(payload, *, hc_schema):
    return _parse_record(Parse6BinReader(payload), hc_schema=hc_schema)


# ---------------------------------------------------------------------------
# The layout
# ---------------------------------------------------------------------------

def test_the_stock_layout_round_trips():
    rec = _parse(
        _record(hc_schema=False,
                salvage=[(2, "S_ArcaneCantrip"), (1, "S_GluonCompound")],
                powers=[(1, "Incarnate.Alpha.Vigor_Boost")],
                incarnate_reward="Incarnate.Alpha.Vigor_Core_Boost",
                requires=["BetaShard", "1", "=="]),
        hc_schema=False)
    assert [(c.amount, c.name) for c in rec.salvage] == \
        [(2, "S_ArcaneCantrip"), (1, "S_GluonCompound")]
    assert [(c.amount, c.name) for c in rec.power_components] == \
        [(1, "Incarnate.Alpha.Vigor_Boost")]
    assert rec.incarnate_reward == "Incarnate.Alpha.Vigor_Core_Boost"
    assert rec.visible_requires == ["BetaShard", "1", "=="]
    assert rec.rarity == 1 and rec.flags == 3
    assert len(rec.display_strings) == 5


def test_the_homecoming_layout_puts_incarnate_fourth_and_contact_sixth():
    rec = _parse(
        _record(hc_schema=True,
                incarnate_reward="Incarnate.Alpha.Vigor_Boost",
                contact_reward="Some/Contact.contact"),
        hc_schema=True)
    assert rec.incarnate_reward == "Incarnate.Alpha.Vigor_Boost"
    assert rec.contact_reward == "Some/Contact.contact"
    assert rec.reward_slot_5 == ""
    assert len(rec.display_strings) == 7


def test_schema_detection_picks_each_layout_by_trial_parse():
    for hc_schema in (True, False):
        payload = _record(hc_schema=hc_schema, incarnate_reward="Incarnate.X.Y")
        r = Parse6BinReader(_u4(len(payload)) + payload)
        rec_len = r.read_u4()
        assert _detect_schema(r, rec_len) is hc_schema


def test_a_trailing_field_refuses_to_parse():
    payload = _record(hc_schema=False, trailing=_u4(7))
    try:
        _parse(payload, hc_schema=False)
    except ValueError as e:
        assert "unread" in str(e)
    else:
        raise AssertionError("a record with 4 trailing bytes parsed cleanly")


def test_an_unconsumed_component_sub_record_refuses_to_parse():
    # A component whose length prefix claims more bytes than amount+link is a
    # layout change inside the sub-record; it must raise, not absorb.
    inner = _u4(1) + _string("S_ArcaneCantrip", 4) + _u4(9)
    payload = _record(hc_schema=False, salvage=[(1, "S_ArcaneCantrip")])
    padded = _u4(1) + _u4(len(inner)) + inner
    normal = _u4(1) + _u4(len(inner) - 4) + inner[:-4]
    assert normal in payload
    try:
        _parse(payload.replace(normal, padded), hc_schema=False)
    except ValueError as e:
        assert "component" in str(e) or "unread" in str(e)
    else:
        raise AssertionError("an over-long component sub-record parsed cleanly")


# ---------------------------------------------------------------------------
# The committed export, as a census
# ---------------------------------------------------------------------------

def _load(fork):
    p = os.path.join(_EXPORT, _FORK_DIR[fork], "incarnate-recipes.json")
    with open(p, encoding="utf-8") as f:
        return json.load(f)["recipes"]


def test_every_fork_export_decodes_meaningful_craft_recipes():
    for fork in _FORK_DIR:
        recipes = _load(fork)
        craft = [r for r in recipes if r["incarnate_reward"]]
        assert craft, f"{fork}: no craft recipes in the export"
        for r in craft:
            assert r["incarnate_reward"].startswith("Incarnate."), \
                f"{fork}: {r['name']} rewards {r['incarnate_reward']!r}"
            for comp in r["salvage"]:
                assert comp["name"].startswith("S_"), \
                    f"{fork}: {r['name']} consumes non-salvage {comp['name']!r}"
            for comp in r["power_components"]:
                assert comp["name"].startswith("Incarnate."), \
                    f"{fork}: {r['name']} consumes non-incarnate {comp['name']!r}"


def test_homecoming_states_exactly_the_three_known_families():
    families = {r["source_file"].rsplit("/", 1)[-1]
                for r in _load("homecoming") if r["incarnate_reward"]}
    assert families == {"INCARNATE.RECIPE", "INCARNATE_PVP.RECIPE",
                        "INCARNATE_ALPHA.RECIPE"}


def test_the_hc_only_reward_slot_is_still_empty_corpus_wide():
    # reward_slot_5 was identified positionally and has never held a value; the
    # day it does, it needs a real name and a consumer decision, not a shrug.
    for r in _load("homecoming"):
        assert r["reward_slot_5"] == "", \
            f"{r['name']}: reward_slot_5 populated ({r['reward_slot_5']!r})"


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"ok  {name}")
