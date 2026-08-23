"""Regression guard for the Parse6 CHANCE decode (RB5-b1).

Parse6 has no effect group. Each AttribMod carries one `Chance`, and it is both
the roll that decides whether the effect applies and the roll each tick makes —
so the parser lifts it into a synthetic group chance and leaves a copy on the
template. That much is faithful. What was not: the lift rewrote every zero to
1.0, so a component the game never fires exported as a certain one, and the
whole fork read as though it had no inert effects at all.

The zero is not an "unset" state. `CoH2/source` types the field
`{ "Chance", TOK_F32(AttribModTemplate, fChance, 0) }` and rolls
`if(fRand < pmod->fChance …)` with fRand drawn from [0,1), which nothing at or
below zero can pass.

These read the COMMITTED `exported_powers/` trees — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_parse6_chance.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
# The roster and its roots both come from `_forks`, which derives them from
# `assets_sources.json` and the tree layout. This used to be a hand copy sitting one line
# under the `_forks` import that exists to replace it — the fork list was derived and the
# PATHS to the same forks were not, so a new dataset was pruned from the root walk and then
# never swept on its own.
_EXPORTS = _forks.FORKS
# Homecoming's tree is the root, so a plain walk of it descends into the other
# two forks and into the boost-piece trees no power lives in.
_NOT_POWERS = set(_forks.NESTED_DIRS) | {"boosts", "set_bonus", "tables", "entities"}


def _load(fork: str, rel_path: str) -> dict:
    with open(os.path.join(_EXPORTS[fork], rel_path)) as f:
        return json.load(f)


def _groups(power: dict):
    """Every (group, template) pair, walking nested children as well."""
    def walk(groups):
        for group in groups:
            for template in group.get("templates") or []:
                yield group, template
            yield from walk(group.get("child_effects") or [])
    return walk(power["effects"])


def _all_powers(fork: str):
    root = _EXPORTS[fork]
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in _NOT_POWERS]
        for name in files:
            if not name.endswith(".json"):
                continue
            with open(os.path.join(dirpath, name)) as f:
                try:
                    power = json.load(f)
                except ValueError:
                    continue
            if isinstance(power, dict) and "effects" in power:
                yield power


def test_a_rebirth_zero_survives_to_the_export():
    """Bullet Rain is the anchor. Rebirth writes its ammo modes as zero-chance
    components of the base power — fire, cold, toxic, the Cryo slow set and a
    full-scale damage-type swap — where Homecoming writes them as redirect
    variants. Every one of them exported as a CERTAIN hit before this, which is
    what made a two-shot attack claim eight damage types at once."""
    rain = _load("rebirth", os.path.join("blaster_ranged", "dual_pistols", "bullet_rain.json"))
    chances = [group["chance"] for group, _ in _groups(rain)]
    assert chances.count(0.0) >= 15, f"Bullet Rain's inert ammo modes: {chances}"
    assert 1.0 in chances, "its base lethal shots still land"
    # The knockback rolls, and rolling is not being inert.
    assert any(abs(chance - 0.5) < 1e-6 for chance in chances), chances


def test_one_authored_power_three_encodings():
    """Fire Sword carries the same three Fire components on every fork, and each
    fork writes them where its schema has room. Homecoming and Thunderspy have an
    effect group, so the burn is `Chance 1.0` + `TickChance 0.8` and the dormant
    Fiery-Embrace pair splits across the two fields. Rebirth has one field saying
    both: 0.8 on the burn, 0 and -0.2 on the pair.

    This is the control that the un-clamp did not simply zero Rebirth out — the
    burn survives it untouched, and only the authored zeros move."""
    rel = os.path.join("brute_melee", "fiery_melee", "fire_sword.json")
    for fork in _EXPORTS:
        pairs = list(_groups(_load(fork, rel)))
        burn = [
            (group, template)
            for group, template in pairs
            if template["attribs"] == ["Fire_Dmg"]
            and abs(template["scale"] - 0.1) < 1e-6
            and template["application_period"] > 0
        ]
        assert len(burn) == 1, f"{fork}: expected one 0.1-scale burn, got {len(burn)}"
        group, template = burn[0]
        assert abs(template["tick_chance"] - 0.8) < 1e-6, f"{fork} burn: {template['tick_chance']}"
        # Rebirth's group chance IS the template's; the other two write 1.0 there.
        expected_group = 0.8 if fork == "rebirth" else 1.0
        assert abs(group["chance"] - expected_group) < 1e-6, f"{fork} burn group: {group['chance']}"

        dormant = [
            (group, template)
            for group, template in pairs
            if template["attribs"] == ["Fire_Dmg"]
            and abs(template["scale"] - 0.594) < 1e-6
        ]
        assert len(dormant) == 1, f"{fork}: the 0.594 Fiery-Embrace instant"
        assert dormant[0][0]["chance"] == 0.0, f"{fork}: {dormant[0][0]['chance']}"


def test_every_fork_ships_inert_effects():
    """The census that retires "Rebirth has no inert components". Floors, not
    exact counts: what this guards is a field reverting to a default, and a
    default shows up as a column that is entirely one value — which is how both
    this gap and Thunderspy's (RB5-b2) survived a corpus gate the first time."""
    # Brainstorm measured 2026-08-22: 1,379 inert groups against Homecoming's 1,377.
    floors = {"homecoming": 900, "rebirth": 1500, "thunderspy": 1500,
              "brainstorm": 900}  # 1377 / 2043 / 2213 / 1379
    for fork, floor in floors.items():
        inert = sum(
            1
            for power in _all_powers(fork)
            for group, _ in _groups(power)
            if group["chance"] == 0.0
        )
        assert inert > floor, f"{fork} ships {inert} inert groups (floor {floor})"


def test_a_chance_the_roll_cannot_consume_carries_as_read():
    """A Chance outside [0,1] is undecoded, not discarded. The source's roll can
    never pass a negative one, but the authored Homecoming defs write them
    verbatim (`TickChance -0.2000` on Fiery Melee, `Chance 1.1000` on Repulsion
    Field), so they are data with a meaning we have not read — carried through
    rather than clamped, dropped, or rounded into range. The parser counts them
    on the way past; this pins that the value itself survives."""
    rel = os.path.join("brute_melee", "fiery_melee", "fire_sword.json")
    for fork in _EXPORTS:
        pairs = list(_groups(_load(fork, rel)))
        # The 0.045 Fiery-Embrace DoT: -0.2 on whichever field the fork has.
        negatives = [
            min(group["chance"], template["tick_chance"])
            for group, template in pairs
            if abs(template["scale"] - 0.045) < 1e-6
        ]
        assert negatives, f"{fork}: no 0.045 Fiery-Embrace DoT"
        assert all(abs(value + 0.2) < 1e-6 for value in negatives), f"{fork}: {negatives}"


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            fn()
            print(f"PASS {name}")
        except AssertionError as e:
            failures += 1
            print(f"FAIL {name}: {e}")
    print(f"\n{failures} failed" if failures else "\nall passed")
    raise SystemExit(1 if failures else 0)
