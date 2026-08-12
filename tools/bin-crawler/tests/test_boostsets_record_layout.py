"""Regression guard for the boostset record layout (BOOST-1).

The reader used to guess where a boostset record's power list started. It read
`ConversionGroups` — a counted string array — as two optional scalars, a rarity
followed by a maybe-category, and told the two shapes apart by peeking for an
"EC" prefix. That works for every set that states a rarity. Thunderspy's
Overwhelming Force states NO conversion groups, so its power count landed in the
rarity slot, and a 1,905-power set with six pieces and five bonus tiers decoded
as three bytes of garbage — which the export then carried as fact for months,
because a record that decodes into a plausible shape looks exactly like a record
that says very little.

Two independent things grade the fix, because each is blind to what the other
catches:

  - **The layout, on bytes built here.** A record with zero conversion groups is
    the case that used to break, and it needs no game install to state. The same
    encoder proves the byte-accounting assertion actually fires: append a field
    the struct does not have and the parse must refuse, since silently ignoring
    a trailing field is how the next fork's addition would shift every offset
    after it without anyone noticing.
  - **The committed export, as a census.** The bytes above are ours, so they can
    only show that the reader is self-consistent. Only the export can show what
    the real records say, and the misparse's signature is visible there without
    knowing anything about any particular set: a set that names no pieces, a
    level range of 0-0, or a power name with a NUL in it.

Reads committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_boostsets_record_layout.py
or under pytest (functions are named test_*).
"""

import json
import os
import struct
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from bin_crawler.parser._boostsets import (  # noqa: E402
    _parse_record,
    _resolve_category,
    _resolve_planner_fields,
    build_power_category_index,
)
from bin_crawler.parser._reader import Parse6BinReader  # noqa: E402

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

_FORK_DIR = {"homecoming": "", "rebirth": "rebirth", "thunderspy": "thunderspy"}


# ---------------------------------------------------------------------------
# A Parse6 encoder — the reader's rules, written the other way round.
# ---------------------------------------------------------------------------

def _u4(n):
    return struct.pack("<I", n)


def _string(s, pos):
    """u16 length, the bytes, then padding to the next 4-byte boundary."""
    out = struct.pack("<H", len(s)) + s.encode("ascii")
    end = pos + len(out)
    return out + b"\x00" * ((4 - end % 4) % 4)


def _record(conversion_groups, powers, boostlists, bonuses,
            min_level=10, max_level=25, tail_int=0, store_product="",
            display_name="P83626102", group_name="P616951717",
            trailing=b""):
    """One ParseBoostSet record's payload, fields in table order.

    `display_name` and `group_name` default to P-hashes because that is what the
    binary holds; the exporter resolves them to text before anything reads them,
    so a test about either passes the resolved string it wants to exercise.
    """
    buf = b""

    def put_str(s):
        nonlocal buf
        buf += _string(s, len(buf))

    put_str("Bonesnap")
    put_str(display_name)
    put_str(group_name)
    buf += _u4(len(conversion_groups))
    for group in conversion_groups:
        put_str(group)
    buf += _u4(len(powers))
    for power in powers:
        put_str(power)

    def put_block(payload):
        nonlocal buf
        buf += _u4(len(payload)) + payload

    buf += _u4(len(boostlists))
    for boosts in boostlists:
        inner = b""
        inner += _u4(len(boosts))
        for boost in boosts:
            inner += _string(boost, len(inner))
        put_block(inner)

    buf += _u4(len(bonuses))
    for min_boosts, max_boosts, requires, auto_powers in bonuses:
        inner = _string("", 0)                       # DisplayText
        inner += _u4(min_boosts) + _u4(max_boosts)
        inner += _u4(len(requires))
        for token in requires:
            inner += _string(token, len(inner))
        inner += _u4(len(auto_powers))
        for auto in auto_powers:
            inner += _string(auto, len(inner))
        inner += _string("", len(inner))             # BonusPower
        put_block(inner)

    buf += _u4(min_level) + _u4(max_level) + _u4(tail_int)
    put_str(store_product)
    return buf + trailing


def _parse(payload):
    """Parse one record and resolve the planner views, as the exporter does."""
    rec = _parse_record(Parse6BinReader(payload), parse6=True)
    _resolve_planner_fields([rec])
    return rec


# ---------------------------------------------------------------------------
# The layout
# ---------------------------------------------------------------------------

def test_a_set_that_states_no_conversion_group_still_finds_its_powers():
    """The case that broke: no rarity, no category, straight to the power count.

    Nothing but the array's own count says how many conversion groups to skip,
    so a reader that infers the count from what the strings LOOK like reads this
    record's power count as a rarity and everything after it at the wrong
    offset.
    """
    rec = _parse(_record(
        conversion_groups=[],
        powers=["Blaster_Ranged.Archery.Aimed_Shot", "Scrapper_Melee.Katana.Gambler_s_Cut"],
        boostlists=[["Boosts.Attuned_Overwhelming_Force_A.Attuned_Overwhelming_Force_A"]],
        bonuses=[(2, 6, [], ["Set_Bonus.Set_Bonus.Improved_Regeneration_5"])],
        min_level=1, max_level=50,
    ))
    assert rec.conversion_groups == []
    assert rec.rarity == "" and rec.category == ""
    assert rec.allowed_powers == [
        "Blaster_Ranged.Archery.Aimed_Shot",
        "Scrapper_Melee.Katana.Gambler_s_Cut",
    ]
    assert [bl.boosts for bl in rec.boostlists] == [
        ["Boosts.Attuned_Overwhelming_Force_A.Attuned_Overwhelming_Force_A"]
    ]
    assert (rec.min_level, rec.max_level) == (1, 50)


def test_the_two_conversion_groups_land_in_rarity_and_category():
    rec = _parse(_record(
        conversion_groups=["ECUncommon", "ECMelee"],
        powers=["Blaster_Support.Darkness_Manipulation.Smite"],
        boostlists=[["Boosts.Crafted_Bonesnap_A.Crafted_Bonesnap_A"]],
        bonuses=[],
    ))
    assert rec.conversion_groups == ["ECUncommon", "ECMelee"]
    assert rec.rarity == "ECUncommon"
    assert rec.category == "ECMelee"


def test_a_gated_bonus_keeps_its_requires_and_its_auto_powers():
    """The Requires array sits between MaxBoosts and AutoPowers.

    Reading it as one opaque int put the auto-power count where the first
    Requires token was, which failed a plausibility bound and returned an EMPTY
    auto-power list — so every PvP tier and every unique-piece global stated
    nothing at all, on all three forks, without a single parse error.
    """
    rec = _parse(_record(
        conversion_groups=["ECVeryRare"],
        powers=["Blaster_Ranged.Archery.Aimed_Shot"],
        boostlists=[],
        bonuses=[(2, 6, ["isPVPMap?"], ["Set_Bonus.PVP_Set_Bonus.Increased_Endurance_4"])],
    ))
    bonus = rec.bonuses[0]
    assert bonus.requires == ["isPVPMap?"]
    assert bonus.auto_powers == ["Set_Bonus.PVP_Set_Bonus.Increased_Endurance_4"]
    assert (bonus.min_boosts, bonus.max_boosts) == (2, 6)


def test_a_record_that_does_not_end_where_the_struct_says_is_refused():
    """A field the struct does not have must break the parse, not be ignored."""
    payload = _record(
        conversion_groups=["ECUncommon", "ECMelee"],
        powers=["Blaster_Support.Darkness_Manipulation.Smite"],
        boostlists=[],
        bonuses=[],
        trailing=_u4(1),
    )
    try:
        _parse(payload)
    except ValueError as err:
        assert "unread byte" in str(err), err
    else:
        raise AssertionError("a record with an unread trailing field parsed clean")


def test_a_third_conversion_group_is_refused_rather_than_dropped():
    """Only two slots have a planner meaning, so a third must not vanish."""
    payload = _record(
        conversion_groups=["ECUncommon", "ECMelee", "ECSomethingNew"],
        powers=["Blaster_Support.Darkness_Manipulation.Smite"],
        boostlists=[],
        bonuses=[],
    )
    try:
        _parse(payload)
    except ValueError as err:
        assert "conversion groups" in str(err), err
    else:
        raise AssertionError("a third conversion group parsed clean")


# ---------------------------------------------------------------------------
# The export
# ---------------------------------------------------------------------------

def _boostsets(fork):
    path = os.path.join(_EXPORT, _FORK_DIR[fork], "boostsets.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def test_every_exported_set_names_its_pieces_and_a_level_range():
    """A set that names no piece is nothing a player can slot.

    This is the misparse's signature stated without naming any set: a record read
    at the wrong offset loses its trailing block first, and comes out with no
    pieces, no bonuses and a 0-0 level range while its header still looks fine.
    """
    silent = []
    for fork in _FORK_DIR:
        for s in _boostsets(fork):
            if not s["boostlists"]:
                silent.append(f"{fork}:{s['name']} names no pieces")
            elif not (1 <= s["min_level"] <= s["max_level"] <= 60):
                silent.append(
                    f"{fork}:{s['name']} levels {s['min_level']}-{s['max_level']}")
    assert not silent, "\n  ".join([f"{len(silent)} set(s) state nothing:"] + silent)


def test_no_exported_power_name_carries_a_misparse_marker():
    """Power names are plain ASCII `Category.Powerset.Power`.

    When a length prefix is read at the wrong offset the decoder swallows the
    rest of the list into one string, so the NULs and length bytes between the
    entries end up INSIDE a name. That is a byte-level tell no amount of
    knowledge about any particular set is needed to see.
    """
    malformed = []
    for fork in _FORK_DIR:
        for s in _boostsets(fork):
            for power in s["allowed_powers"]:
                if "\x00" in power or "�" in power or power.count(".") != 2:
                    malformed.append(f"{fork}:{s['name']}: {power[:60]!r}")
    assert not malformed, "\n  ".join(
        [f"{len(malformed)} malformed power name(s):"] + malformed[:20])


def test_no_exported_set_states_more_than_two_conversion_groups():
    for fork in _FORK_DIR:
        for s in _boostsets(fork):
            assert len(s["conversion_groups"]) <= 2, (
                f"{fork}:{s['name']} states {s['conversion_groups']}")


def test_the_slot_category_is_the_group_name_the_client_groups_by():
    """`GroupName`, not a reading of `ConversionGroups`.

    The two fields answer different questions. `ConversionGroups` feeds the
    enhancement converter — the game keys `htConversionLists` off it and
    `boostset_findConversionSet` reads element 0. `GroupName` is the heading a
    power lists the set under, collected straight into the
    "AllowedBoostCategories" tooltip by `Game/src/UI/uiCombineSpec.c`.

    Reading the first to answer the second reproduces the second exactly on
    Homecoming, which is why it survived, and drifts on both forks.
    """
    rec = _parse(_record(
        group_name="PBAoE Damage",
        conversion_groups=["ECUncommon", "ECMelee"],
        powers=["Brute_Melee.Battle_Axe.Cleave"],
        boostlists=[["Boosts.Crafted_Cleaving_Blow_A.Crafted_Cleaving_Blow_A"]],
        bonuses=[],
    ))
    assert _resolve_category(rec) == "PBAoE Damage"
    assert build_power_category_index([rec]) == {
        "Brute_Melee.Battle_Axe.Cleave": ["PBAoE Damage"]
    }


def test_a_record_reaches_its_powers_whatever_its_display_name_says():
    """The client attaches every boostset to every power in its `Powers` array.

    `boostset_FixPointers` (`Common/entity/boostset.c`) pushes the set onto each
    power with no test on any of the record's names, and the one name guard in the
    whole path — `mapBoostSetGroupNameToBasePowerName` — tests `GroupName`. So a
    dev-looking display name is no reason to drop a record: Thunderspy leaves
    Overwhelming Force's at a placeholder while shipping the set in-game, and
    filtering on it made six real pieces unslottable (BOOST-2).
    """
    rec = _parse(_record(
        display_name="SumoBoostName",
        group_name="Universal Damage Sets",
        conversion_groups=[],
        powers=["Blaster_Ranged.Archery.Aimed_Shot"],
        boostlists=[["Boosts.Attuned_Overwhelming_Force_A.Attuned_Overwhelming_Force_A"]],
        bonuses=[],
    ))
    assert build_power_category_index([rec]) == {
        "Blaster_Ranged.Archery.Aimed_Shot": ["Universal Damage Sets"]
    }


def test_every_exported_set_states_a_group_name():
    """A record that states none is unreachable, and the client skips it too.

    Nothing on any fork does — which is what makes `GroupName` usable as the one
    category source, where `ConversionGroups` is absent on two thirds of the corpus.
    """
    silent = [f"{fork}:{s['name']}"
              for fork in _FORK_DIR for s in _boostsets(fork) if not s["group_name"]]
    assert not silent, f"{len(silent)} set(s) state no GroupName: " + ", ".join(silent)


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"ok  {name}")
    print("all boostset layout guards pass")
