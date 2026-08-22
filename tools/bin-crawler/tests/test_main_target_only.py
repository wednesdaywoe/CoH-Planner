"""Regression guard for the Parse6 ProcMainTargetOnly / AnimMainTargetOnly read
(PPM-3).

`ProcMainTargetOnly` (`BasePower.bUseNonBoostTemplatesOnMainTarget`) is what
makes `basepower_CalculateAreaFactor` return 1.0 outright — no AoE penalty on a
PPM proc — before it ever looks at radius (`powers.c:2806`). Homecoming exported
it from the start; Rebirth and Thunderspy exported ZERO carriers, because the
Parse6 tail reader stopped at `StrengthsDisallowed` and the two bools sit
immediately after it in the stock i24 parse table (`powers_load.c:2192-2194`).

That is the WRAP-2 shape: a fork-wide zero is a statement about the reader until
you have checked the reader. Both fields ARE in the released parse table, so
"stock Parse6 lacks them" was never a safe reading of the absence.

Pinned by CENSUS, like TSPY-5 next door: the failure mode is the carrier count
going back to zero, and no structural guard can see that — reading two words
that happen to be zero trips no alignment check.

These read the COMMITTED `exported_powers/` trees — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_main_target_only.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORTS = {
    "homecoming": os.path.join(_REPO, "exported_powers"),
    "rebirth": os.path.join(_REPO, "exported_powers", "rebirth"),
    "thunderspy": os.path.join(_REPO, "exported_powers", "thunderspy"),
}
# Homecoming's tree is the root, so a plain walk descends into the other two
# forks and into the boost-piece trees no power lives in.
_NOT_POWERS = set(_forks.NESTED_DIRS) | {"boosts", "set_bonus", "tables", "entities"}

# Both fields are sparse-true: the exporter writes the key only when the bool is
# set, so an absent key is the authored `false` and not a dropped read.
_PROC = "procs_only_on_main_target"
_ANIM = "anim_main_target_only"


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


def _flags(fork: str, key: str) -> dict[str, bool]:
    """Every power's flag, keyed by path within its fork — the same relative
    path names the same power across forks."""
    return {path: bool(power.get(key)) for path, power in _all_powers(fork)}


def test_every_fork_authors_proc_main_target_only():
    """The non-vacuity check, and the one that fails if the read regresses. A
    fork dropping to zero carriers is the Parse6 reader stopping short again,
    not a fork that stopped authoring the field."""
    for fork in _EXPORTS:
        carriers = [p for p, v in _flags(fork, _PROC).items() if v]
        assert len(carriers) > 50, (
            f"{fork} exports {len(carriers)} ProcMainTargetOnly carriers — a "
            f"fork authoring none is the PPM-3 misread, not real absence")


def test_every_fork_authors_anim_main_target_only():
    """The second bool is read for the same reason the first is: the cursor
    passes over it either way, and unknown-but-exported beats discarded."""
    for fork in _EXPORTS:
        carriers = [p for p, v in _flags(fork, _ANIM).items() if v]
        assert len(carriers) > 50, (
            f"{fork} exports {len(carriers)} AnimMainTargetOnly carriers — see "
            f"the ProcMainTargetOnly guard above")


def test_the_two_flags_are_distinct_fields():
    """The alignment check that a count cannot make. The two words are adjacent
    bools, so a read shifted by one produces a perfectly plausible census — it
    is only visible as the two fields collapsing onto each other. They overlap
    substantially (both mark main-target-scoped powers) but neither contains
    the other."""
    for fork in _EXPORTS:
        proc = {p for p, v in _flags(fork, _PROC).items() if v}
        anim = {p for p, v in _flags(fork, _ANIM).items() if v}
        assert proc != anim, f"{fork}: the two main-target flags are identical sets"
        assert proc - anim, f"{fork}: every ProcMainTargetOnly power is also Anim"
        assert anim - proc, f"{fork}: every AnimMainTargetOnly power is also Proc"


def test_forks_agree_with_each_other_on_the_shared_corpus():
    """The independent oracle, and the one that says the read found THIS field
    rather than a neighbour. Rebirth and Thunderspy share a closer ancestor
    than either shares with Homecoming, so their carrier sets should nearly
    coincide. Compared as a Jaccard over the TRUE sets, never as a per-power
    agreement rate: the field is sparse, so agreement-on-everything sits at 99%
    whatever the read lands on — the vacuity trap this fork pair has fallen
    into before."""
    reb = _flags("rebirth", _PROC)
    tsp = _flags("thunderspy", _PROC)
    shared = set(reb) & set(tsp)
    assert len(shared) > 1000, f"only {len(shared)} shared powers — join broke"
    reb_true = {p for p in shared if reb[p]}
    tsp_true = {p for p in shared if tsp[p]}
    # Asserted before the ratio, not implied by it: in the regression this
    # guard exists to catch both sets are empty, and an empty union would make
    # the Jaccard a ZeroDivisionError — a crash the runner scores as a failure
    # without this assertion ever being reached.
    assert reb_true and tsp_true, (
        f"rebirth={len(reb_true)} thunderspy={len(tsp_true)} carriers on the "
        f"shared corpus — a fork at zero is the PPM-3 misread")
    jaccard = len(reb_true & tsp_true) / len(reb_true | tsp_true)
    assert jaccard > 0.85, (
        f"rebirth/thunderspy ProcMainTargetOnly sets overlap at {jaccard:.1%} "
        f"({len(reb_true & tsp_true)} of {len(reb_true | tsp_true)}) — too low "
        f"to be the same field")


def test_homecoming_pairs_proc_with_proc_not_with_anim():
    """Which of the two adjacent words is which, settled against the only read
    validated by the authored `.powers` defs (92 TP / 0 FP / 0 FN). If the
    Parse6 read were shifted by one word, its ProcMainTargetOnly would track
    Homecoming's AnimMainTargetOnly instead. Overlap with the matching field
    must beat overlap with the neighbour by a wide margin."""
    hc_proc = {p for p, v in _flags("homecoming", _PROC).items() if v}
    hc_anim = {p for p, v in _flags("homecoming", _ANIM).items() if v}
    for fork in ("rebirth", "thunderspy"):
        fork_proc = {p for p, v in _flags(fork, _PROC).items() if v}
        matching = len(fork_proc & hc_proc)
        neighbour = len(fork_proc & hc_anim)
        assert matching > 2 * neighbour, (
            f"{fork} ProcMainTargetOnly overlaps homecoming's Proc on "
            f"{matching} powers and its Anim on {neighbour} — the read is "
            f"one word off")


def test_gauntlet_powers_carry_it_on_the_forks_and_not_on_homecoming():
    """The divergence is explained, so it is pinned rather than tolerated. The
    powers both forks flag and Homecoming does not are Tanker melee attacks,
    and this flag is what scopes an i24 Tanker attack's non-boost templates to
    the main target — Gauntlet. Homecoming reworked Gauntlet and dropped the
    flag; the forks kept i24's. A future read that lost the fork half would
    still pass every count above, because Homecoming's own carriers would
    carry it."""
    hc = {p for p, v in _flags("homecoming", _PROC).items() if v}
    reb = {p for p, v in _flags("rebirth", _PROC).items() if v}
    tsp = {p for p, v in _flags("thunderspy", _PROC).items() if v}
    fork_only = (reb & tsp) - hc
    tanker = [p for p in fork_only if "tanker" in p.lower()]
    assert len(tanker) > 20, (
        f"only {len(tanker)} of {len(fork_only)} fork-only carriers are Tanker "
        f"melee — the Gauntlet population is the shape this read produced, and "
        f"losing it means the fork half regressed")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"  ok  {name}")
    print("all main-target-only guards pass")
