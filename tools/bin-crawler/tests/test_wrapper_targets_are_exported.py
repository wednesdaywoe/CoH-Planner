"""Every power a wrapper delegates its work to is in the export (HC-4).

A wrapper power does nothing itself: it carries `Execute_Power` (Homecoming,
Thunderspy) or `Power_Redirect` (Rebirth) and names the child that does the work.
The exporter keeps the player categories plus the powers a player power
references, so most children arrive with their category — but a child filed under
`Temporary_Powers` or `Mission_Maker_Pets` reached the export only if something
GRANTED it, and `Grant_Power` is a different edge. Eight children across
Homecoming and Thunderspy were named by a wrapper and exported by nothing, so the
edge dead-ended: the census could not score the child, and no consumer could
follow the delegation at all.

Pinned by RESOLUTION, not by count: the failure is a name pointing at nothing, and
only looking the name up can see it. Each fork also has a floor on how many
references were checked, because a walk that finds no wrapper at all would
otherwise pass.

Reads only committed JSON — no .bin / .pigg needed.

Run directly:  python3 tools/bin-crawler/tests/test_wrapper_targets_are_exported.py
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

# The two spellings of the same delegation. Rebirth authors no `Execute_Power`
# template at all and Homecoming/Thunderspy author no `Power_Redirect` one, so a
# scan written against either name alone reports the other fork as wrapper-free
# (DATA-GAP WRAP-2).
_WRAPPER_ATTRIBS = ("Execute_Power", "Power_Redirect")

# Floors, not targets: roughly half what each fork carries today, rounded to a round
# number. They exist so a walk that stops finding wrappers fails instead of passing over
# nothing. Measured: HC 593, Rebirth 235, Thunderspy 76, Brainstorm 699.
_MINIMUM_REFERENCES = {"homecoming": 300, "rebirth": 100, "thunderspy": 50, "brainstorm": 350}


def _load_fork(fork):
    """(exported full names lowercased, [(power, target) wrapper references])."""
    names = set()
    references = []
    base = os.path.join(_EXPORT, _FORK_DIR[fork])
    for root, _dirs, files in os.walk(base):
        relative = os.path.relpath(root, _EXPORT).split(os.sep)
        if fork == "homecoming" and relative[0] in _forks.NESTED_DIRS:
            continue
        for name in files:
            if not name.endswith(".json"):
                continue
            try:
                with open(os.path.join(root, name)) as handle:
                    record = json.load(handle)
            except (OSError, ValueError):
                continue
            if not isinstance(record, dict) or "full_name" not in record:
                continue
            names.add(record["full_name"].lower())

            def walk(groups):
                for group in groups or []:
                    for template in group.get("templates") or []:
                        attribs = template.get("attribs") or []
                        if not set(attribs) & set(_WRAPPER_ATTRIBS):
                            continue
                        params = template.get("params") or {}
                        for target in params.get("power_names") or []:
                            references.append((record["full_name"], target))
                    walk(group.get("child_effects"))

            walk(record.get("effects"))
            walk(record.get("activation_effects"))
    return names, references


_FORKS = {fork: _load_fork(fork) for fork in _FORK_DIR}


def test_every_fork_authors_wrappers():
    """A fork with no wrapper reference would make the resolution test vacuous."""
    for fork, (_names, references) in _FORKS.items():
        floor = _MINIMUM_REFERENCES[fork]
        assert len(references) >= floor, (
            f"{fork} exports {len(references)} wrapper reference(s), below the "
            f"floor of {floor} — the attrib is going unread again"
        )


def test_every_wrapper_names_a_power_the_export_carries():
    """The delegation resolves. An unresolvable name is a child nothing can score."""
    for fork, (names, references) in _FORKS.items():
        missing = sorted({target for _parent, target in references
                          if target.lower() not in names})
        assert not missing, (
            f"{fork}: {len(missing)} wrapper target(s) name a power that is not in "
            f"the export — {missing[:5]}; referenced-target inclusion is following "
            f"the grant edge only"
        )


def test_the_children_outside_the_player_categories_are_the_ones_at_risk():
    """The category filter is why this can regress, so pin that it is still crossed.

    Children under Pets/*_Aux ride along with their whole category and were never
    the gap; children under any other non-player category arrive ONLY because a
    reference pulled them in, one at a time.
    """
    hosts = set()
    for fork, (_names, references) in _FORKS.items():
        for _parent, target in references:
            category = target.split(".")[0].lower()
            if category not in ("pets", "temporary_powers", "mission_maker_pets"):
                continue
            if category != "pets":
                hosts.add((fork, target.lower()))
    assert hosts, (
        "no wrapper names a child outside the Pets categories — the reference-only "
        "inclusion path is no longer exercised by any fork"
    )
    for fork, target in sorted(hosts):
        assert target in _FORKS[fork][0], f"{fork}: {target} was not pulled in"


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
