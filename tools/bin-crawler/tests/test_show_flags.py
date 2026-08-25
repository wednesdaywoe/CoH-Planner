"""Regression guard for the Show* power-flag reads (SHOWFLAGS-1).

ShowInInventory / ShowInManage / ShowInInfo sit between ShowBuffIcon and
Deletable in every layout's post-effects tail, and both tail readers named
them in their docstrings while skipping over all three on the way to
MaxBoosts. `show_in_manage` therefore never reached the export, the
converter's set-mechanic classification (`hiddenPassive`/`hiddenAuto`) was
unreachable, and 12 set-mechanic grants — Seismic Shockwaves, Bio Armor's
Adaptation, Staff Mastery — were offered as level picks in both planners.

Absence and "no fork authors it" have the same shape (the TSPY-5 lesson), so
the guards here are CENSUS floors per fork, a closed-vocabulary check, the
cross-fork agreement oracle, and — where `raw defs/` is present — the
authored-def oracle compared per power in both directions. A fork whose
carrier count returns to zero is the misread again, not real absence.

These read the COMMITTED `exported_powers/` trees — no .bin / .pigg needed.
The def leg reads `raw defs/` and SKIPS LOUDLY when it is absent (same
posture as tools/defdiff.py; COH_RAW_DEFS relocates it).

Run directly:  python3 tools/bin-crawler/tests/test_show_flags.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os
import re

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORTS = _forks.FORKS
_NOT_POWERS = set(_forks.NESTED_DIRS) | {"boosts", "set_bonus", "tables", "entities"}
_DEFS = os.environ.get("COH_RAW_DEFS", os.path.join(_REPO, "raw defs"))

# The ShowPowerSetting spellings the export may emit. `Default` is the
# parse-table default and is stated by ABSENCE, so it never appears.
_INVENTORY_VOCAB = {"Never", "Always", "IfUsable", "IfOwned"}

# Per-fork carrier floors over the POWER corpus this file walks (boost/entity
# trees pruned), measured at fix time (2026-08-24) and set just under the
# observed counts so a re-export that loses the read goes red while ordinary
# game drift does not.
_MANAGE_FALSE_FLOOR = {
    "homecoming": 900,   # observed 992
    "brainstorm": 900,   # observed 1020
    "rebirth": 400,      # observed 470
    "thunderspy": 350,   # observed 406
}


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


def _show_flags(fork: str) -> dict[str, tuple]:
    """(show_in_manage, show_in_info, show_in_inventory) per power, keyed by
    path within the fork — the same relative path names the same power across
    forks. `None` is the sparse export's stated default."""
    return {
        path: (
            power.get("show_in_manage"),
            power.get("show_in_info"),
            power.get("show_in_inventory"),
        )
        for path, power in _all_powers(fork)
    }


def test_every_fork_authors_show_in_manage_false():
    """The non-vacuity check, and the one that fails if the read regresses:
    the i24 corpus every fork inherits authors `ShowInManage kFalse` by the
    hundred, so a fork whose carriers drop to zero lost the READ."""
    for fork in _EXPORTS:
        flags = _show_flags(fork)
        manage_false = sum(1 for m, _, _ in flags.values() if m is False)
        floor = _MANAGE_FALSE_FLOOR[fork]
        assert manage_false >= floor, (
            f"{fork} exports {manage_false} show_in_manage=false carriers "
            f"(floor {floor}) — a fork authoring none is the SHOWFLAGS-1 "
            f"misread, not real absence")


def test_show_flag_vocabulary_is_closed():
    """The sparse encoding is part of the contract with the converter: bools
    appear only as `false` (absence states true), and the inventory enum
    appears only as a non-Default member. Anything else means the emitter or
    the read moved."""
    for fork in _EXPORTS:
        for path, (manage, info, inventory) in _show_flags(fork).items():
            assert manage in (None, False), f"{fork}:{path} show_in_manage={manage!r}"
            assert info in (None, False), f"{fork}:{path} show_in_info={info!r}"
            assert inventory is None or inventory in _INVENTORY_VOCAB, (
                f"{fork}:{path} show_in_inventory={inventory!r} — not in "
                f"{sorted(_INVENTORY_VOCAB)}")


def test_thunderspy_agrees_with_rebirth_on_the_shared_corpus():
    """The independent oracle: both forks descend from one i24 corpus, so the
    powers they share should show the same flags. Exact agreement is not the
    bar (the forks curate), but far below this means one side's read landed
    on a neighbouring word."""
    tspy = _show_flags("thunderspy")
    reb = _show_flags("rebirth")
    shared = set(tspy) & set(reb)
    assert len(shared) > 1000, f"only {len(shared)} shared powers — join broke"
    agree = sum(1 for path in shared if tspy[path] == reb[path])
    ratio = agree / len(shared)
    assert ratio > 0.97, (
        f"thunderspy/rebirth agree on {agree}/{len(shared)} ({ratio:.1%}) of "
        f"shared powers' Show* flags — too low to be the same fields")


# --- the authored-def oracle -------------------------------------------------

_BOOL_FALSE = {"kfalse", "false", "knever", "never", "0"}
# Def spelling -> the export's expected spelling; None = the Default the
# sparse export states by absence. kTrue/true alias Default in the game's own
# StaticDefineInt table (powers_load.c ShowPowerSettingEnum).
_INV_BY_DEF = {
    "knever": "Never", "never": "Never", "kfalse": "Never", "false": "Never",
    "ktrue": None, "true": None, "kdefault": None, "default": None,
    "kalways": "Always", "always": "Always",
    "kifusable": "IfUsable", "ifusable": "IfUsable",
    "kifowned": "IfOwned", "ifowned": "IfOwned",
}
_DEF_TOKEN = re.compile(r"^\s*(ShowInManage|ShowInInfo|ShowInInventory)\s+(\S+)", re.M)


def test_root_dataset_matches_the_authored_defs():
    """Per-power, both directions, on the root (Homecoming) dataset: every
    authored Show* line must read back exactly, and every exported non-default
    must be authored. The defs are this repo's only oracle that catches a
    parser DROP — the export agreeing with itself is what hid SHOWFLAGS-1."""
    if not os.path.isdir(_DEFS):
        print(f"  SKIP (loudly): no defs at {_DEFS} — the def leg DID NOT RUN")
        return

    export = {
        power["full_name"].lower(): power
        for _, power in _all_powers(_forks.ROOT_DATASET)
        if "full_name" in power
    }

    checked = 0
    mismatches = []
    for dirpath, _dirs, files in os.walk(_DEFS):
        for name in files:
            if not name.endswith(".powers"):
                continue
            def_path = os.path.join(dirpath, name)
            rel = os.path.relpath(def_path, _DEFS)
            full = ".".join(rel[: -len(".powers")].split(os.sep)).lower()
            power = export.get(full)
            if power is None:
                continue  # authored def outside the exported categories
            with open(def_path, errors="replace") as f:
                text = f.read()
            authored = {m.group(1): m.group(2).lower()
                        for m in _DEF_TOKEN.finditer(text)}
            inv_raw = authored.get("ShowInInventory")
            if inv_raw is not None and inv_raw not in _INV_BY_DEF:
                mismatches.append((full, f"unparsed def spelling {inv_raw!r}"))
                continue
            want = (
                False if authored.get("ShowInManage", "") in _BOOL_FALSE else None,
                False if authored.get("ShowInInfo", "") in _BOOL_FALSE else None,
                _INV_BY_DEF[inv_raw] if inv_raw is not None else None,
            )
            got = (
                power.get("show_in_manage"),
                power.get("show_in_info"),
                power.get("show_in_inventory"),
            )
            checked += 1
            if got != want:
                mismatches.append((full, f"def says {want}, export says {got}"))

    # 3,789 defs matched the export at fix time; well under that means the
    # name join broke and the sweep is grading a sliver.
    assert checked > 3000, f"only {checked} defs joined to the export — join broke"
    assert not mismatches, (
        f"{len(mismatches)} def/export Show* disagreements "
        f"(first 10): {mismatches[:10]}")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"  ok  {name}")
    print("all Show* flag guards pass")
