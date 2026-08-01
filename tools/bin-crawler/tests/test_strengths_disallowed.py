"""Regression guard for the Parse6/Thunderspy StrengthsDisallowed read (TSPY-5).

`StrengthsDisallowed` is the per-power list of attributes no Strength applies
to — the field the server zeroes after copying the character's Strength set
onto a power (`character_mods.c character_AccrueBoosts`). Thunderspy exported
ZERO carriers across 20,965 records while Homecoming and Rebirth exported
thousands, including over the i24 NPC corpus all three forks inherit.

The cause was `ProcAllowed`. Homecoming added that word between
`ToggleDroppable` and `StrengthsDisallowed`; stock Parse6 has no such field,
and the Thunderspy tail was read as stock Parse6. So the always-zero
ProcAllowed word stood where the array's count belongs, `read_u4_array`
returned empty every time, and the fork read as authoring none.

Nothing raised, because an empty array is the one value that trips neither
guard the reader has: `len(...) > 64` and `v % 4` both hold vacuously. That is
why this is pinned by CENSUS rather than by a guard — the count going back to
zero is the failure, and only counting can see it.

These read the COMMITTED `exported_powers/` trees — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_strengths_disallowed.py
or under pytest (functions are named test_*).
"""

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORTS = {
    "homecoming": os.path.join(_REPO, "exported_powers"),
    "rebirth": os.path.join(_REPO, "exported_powers", "rebirth"),
    "thunderspy": os.path.join(_REPO, "exported_powers", "thunderspy"),
}
# Homecoming's tree is the root, so a plain walk of it descends into the other
# two forks and into the boost-piece trees no power lives in.
_NOT_POWERS = {"rebirth", "thunderspy", "boosts", "set_bonus", "tables", "entities"}


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
                yield os.path.relpath(os.path.join(dirpath, name), root), power


def _disallowed(fork: str) -> dict[str, frozenset]:
    """Every power's StrengthsDisallowed set, keyed by path within its fork —
    the same relative path names the same power across forks."""
    return {
        path: frozenset(power.get("strengths_disallowed") or ())
        for path, power in _all_powers(fork)
    }


def test_every_fork_authors_strengths_disallowed():
    """The non-vacuity check, and the one that fails if the read regresses:
    a fork whose carriers drop to zero is TSPY-5 again, not a fork that
    stopped authoring the field."""
    for fork in _EXPORTS:
        carriers = [p for p, s in _disallowed(fork).items() if s]
        assert len(carriers) > 100, (
            f"{fork} exports {len(carriers)} StrengthsDisallowed carriers — a "
            f"fork authoring none is the TSPY-5 misread, not real absence")


def test_disallowed_attribs_resolve_to_names():
    """The offsets are raw attrib values resolved through each fork's own
    table. An `Unknown(n)` / `Special(n)` means the offset landed outside the
    band the resolver knows — the honest spelling of a misread, and a real
    value would be a fork addition worth naming."""
    for fork in _EXPORTS:
        unresolved = {
            path: sorted(names)
            for path, names in _disallowed(fork).items()
            if any(n.startswith(("Unknown(", "Special(")) for n in names)
        }
        assert not unresolved, f"{fork} has unresolved attribs: {list(unresolved)[:5]}"


def test_thunderspy_agrees_with_rebirth_on_the_shared_corpus():
    """The independent oracle. Both forks descend from the same i24 corpus, so
    the powers they share should disallow the same attributes — and Rebirth's
    read of this field was never in doubt. Agreement well below this means the
    Thunderspy read is finding SOMETHING at that offset but not this field;
    exact agreement is not the bar, because Thunderspy rebalances (44 powers
    genuinely differ as of 2026-07-31)."""
    tspy = _disallowed("thunderspy")
    reb = _disallowed("rebirth")
    shared = set(tspy) & set(reb)
    assert len(shared) > 1000, f"only {len(shared)} shared powers — join broke"
    agree = sum(1 for path in shared if tspy[path] == reb[path])
    ratio = agree / len(shared)
    assert ratio > 0.97, (
        f"thunderspy/rebirth agree on {agree}/{len(shared)} ({ratio:.1%}) of "
        f"shared powers' StrengthsDisallowed — too low to be the same field")


def test_thunderspy_disallows_the_same_attribs_the_other_forks_do():
    """Range on melee, RechargeTime on fixed-cooldown powers — the two
    attributes every fork's corpus is made of. A read landing on a neighbouring
    field would produce a different vocabulary, not this one."""
    vocab = {fork: {n for s in _disallowed(fork).values() for n in s}
             for fork in _EXPORTS}
    assert vocab["thunderspy"], "thunderspy authors no StrengthsDisallowed at all"
    assert vocab["thunderspy"] <= vocab["homecoming"] | vocab["rebirth"], (
        f"thunderspy disallows attribs no other fork does: "
        f"{vocab['thunderspy'] - (vocab['homecoming'] | vocab['rebirth'])}")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"  ok  {name}")
    print("all StrengthsDisallowed guards pass")
