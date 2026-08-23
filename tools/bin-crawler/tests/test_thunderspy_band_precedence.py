"""Regression guard for the Thunderspy special-attrib band's precedence (TSPY-7).

Thunderspy's attrib index array is resolved through two tables: the byte-granular
special band (`SPECIAL_ATTRIB_BAND`, the i24 ESpecialAttrib enum) and a collapsed
4-aligned view carried inside the normal attrib table. They overlap on the eleven
band raws that happen to be multiples of four, and there the collapsed view names
the band's NEIGHBOUR — so asking it first renamed `Translucency` to
`Create_Entity`, `XPDebtProtection` to `Set_Mode`, `Drop_Toggles` to
`Grant_Power`, `Combat_Mod_Shift` to `Recharge_Power`.

The signature is a fork-wide zero: Thunderspy exported not one carrier of any of
those four attributes while both other forks carried dozens or hundreds — a
plausible-looking export, because the neighbour it renamed to is a real attrib
that real powers do carry. So this is pinned by CENSUS against the other forks,
the same way TSPY-5 is.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_thunderspy_band_precedence.py
or under pytest (functions are named test_*).
"""

import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import _forks  # derived dataset roster; see test_export_roster.py

import json
import os

_REPO = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_EXPORT = os.path.join(_REPO, "exported_powers")

_FORK_DIR = _forks.FORK_SUBDIR

# The disputed raws that have carriers, each with the fork that can adjudicate it.
# `Drop_Toggles` is Rebirth's to answer: Homecoming authors none at all, so its
# zero there is silence, not a contrary vote.
_DISPUTED = (
    # attrib,             raw, collapsed view's name, adjudicating fork
    ("Translucency",      468, "Create_Entity",   "homecoming"),
    ("XPDebtProtection",  472, "Set_Mode",        "homecoming"),
    ("Drop_Toggles",      480, "Grant_Power",     "rebirth"),
    ("Combat_Mod_Shift",  492, "Recharge_Power",  "homecoming"),
)


def _attribs_by_power(fork):
    """{full_name: {attrib, ...}} across every exported power of `fork`."""
    out = {}
    base = os.path.join(_EXPORT, _FORK_DIR[fork])
    for root, _dirs, files in os.walk(base):
        rel = os.path.relpath(root, _EXPORT).split(os.sep)
        if fork == "homecoming" and rel[0] in _forks.NESTED_DIRS:
            continue
        for name in files:
            if not name.endswith(".json"):
                continue
            try:
                with open(os.path.join(root, name)) as fh:
                    record = json.load(fh)
            except (OSError, ValueError):
                continue
            if not isinstance(record, dict) or "full_name" not in record:
                continue
            attribs = set()

            def walk(groups):
                for group in groups or []:
                    for template in group.get("templates") or []:
                        attribs.update(template.get("attribs") or [])
                    walk(group.get("child_effects"))

            walk(record.get("effects"))
            walk(record.get("activation_effects"))
            out[record["full_name"]] = attribs
    return out


_FORKS = {fork: _attribs_by_power(fork) for fork in _FORK_DIR}


def test_thunderspy_authors_every_disputed_band_attrib():
    """None of the four is fork-wide absent — absence is what the misread looked like."""
    for attrib, raw, collapsed_name, _adjudicator in _DISPUTED:
        carriers = sum(1 for a in _FORKS["thunderspy"].values() if attrib in a)
        assert carriers > 0, (
            f"thunderspy exports no {attrib} carrier (raw {raw}); the collapsed "
            f"4-aligned view is being asked first again and naming it {collapsed_name}"
        )


def test_the_band_name_beats_its_neighbour_on_every_disputed_raw():
    """Each attrib lands on the same powers a fork that can name it lands on.

    Not a threshold against nothing: the comparison is band-name against the
    collapsed view's name over the SAME shared powers, which is the choice the
    reader actually makes. A fork rebalances, so agreement is never total — but
    the losing name is a rounding error every time (Translucency 155 to 16,
    XPDebtProtection 86 to 1, Combat_Mod_Shift 51 to 0).
    """
    thunderspy = _FORKS["thunderspy"]
    for attrib, raw, collapsed_name, adjudicator in _DISPUTED:
        oracle = _FORKS[adjudicator]
        shared = [name for name, attribs in thunderspy.items()
                  if attrib in attribs and name in oracle]
        assert shared, f"no shared {attrib} carrier to grade for raw {raw}"
        band_votes = sum(1 for name in shared if attrib in oracle[name])
        rival_votes = sum(1 for name in shared if collapsed_name in oracle[name])
        assert band_votes > 4 * rival_votes, (
            f"raw {raw}: only {band_votes}/{len(shared)} of thunderspy's "
            f"{attrib} carriers carry it on {adjudicator}, against "
            f"{rival_votes} carrying {collapsed_name} — the collapsed 4-aligned "
            f"view is winning again"
        )
        assert band_votes / len(shared) >= 0.5, (
            f"raw {raw}: {attrib} agrees with {adjudicator} on only "
            f"{band_votes}/{len(shared)} shared carriers"
        )


def test_the_level_shift_power_shifts_the_level_in_every_fork():
    """The anchor the incarnate converter refuses to guess past.

    `Destiny_Silent.Level_Shift` exists to carry one `Combat_Mod_Shift` template.
    Read through the collapsed view it became `Recharge_Power`, and
    `convert-incarnate-effects.cjs` threw rather than invent a level shift —
    which is how this was found.
    """
    for fork, powers in _FORKS.items():
        attribs = powers.get("Incarnate.Destiny_Silent.Level_Shift")
        assert attribs is not None, f"{fork} has no Destiny_Silent.Level_Shift"
        assert "Combat_Mod_Shift" in attribs, (
            f"{fork}'s Destiny_Silent.Level_Shift carries {sorted(attribs)}, "
            f"not Combat_Mod_Shift"
        )


def test_drop_toggles_never_names_a_power():
    """`Drop_Toggles` takes no Params Power block; `Grant_Power` always does.

    That asymmetry is the other half of the raw-480 case: while the collapsed
    view named it `Grant_Power`, thunderspy showed 125 Grant_Power templates with
    no target where both other forks name one on 100% of theirs.

    It pins the INVARIANT, not the misread — Rebirth satisfies it either way, so
    this one stays green on a pre-fix export. `test_thunderspy_authors_every_
    disputed_band_attrib` is what catches the fork-wide zero.
    """
    checked = 0
    for fork, powers in _FORKS.items():
        base = os.path.join(_EXPORT, _FORK_DIR[fork])
        del powers  # the per-power attrib sets can't see params; re-walk instead
        for root, _dirs, files in os.walk(base):
            rel = os.path.relpath(root, _EXPORT).split(os.sep)
            if fork == "homecoming" and rel[0] in _forks.NESTED_DIRS:
                continue
            for name in files:
                if not name.endswith(".json"):
                    continue
                try:
                    with open(os.path.join(root, name)) as fh:
                        record = json.load(fh)
                except (OSError, ValueError):
                    continue
                if not isinstance(record, dict):
                    continue

                def walk(groups):
                    nonlocal checked
                    for group in groups or []:
                        for template in group.get("templates") or []:
                            if "Drop_Toggles" not in (template.get("attribs") or []):
                                continue
                            checked += 1
                            assert not (template.get("params") or {}).get("power_names"), (
                                f"{fork} {record.get('full_name')}: a Drop_Toggles "
                                f"template names a power — it is a Grant_Power"
                            )
                        walk(group.get("child_effects"))

                walk(record.get("effects"))
                walk(record.get("activation_effects"))

    # Vacuity guard: while raw 480 read as Grant_Power there were no Drop_Toggles
    # templates at all, so this would have passed over nothing.
    assert checked > 100, f"only {checked} Drop_Toggles template(s) to check"


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            fn()
            print(f"PASS {name}")
        except AssertionError as err:
            failures += 1
            print(f"FAIL {name}: {err}")
    print("all passed" if not failures else f"{failures} failure(s)")
    raise SystemExit(1 if failures else 0)
