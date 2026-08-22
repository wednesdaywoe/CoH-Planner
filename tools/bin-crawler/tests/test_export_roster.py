"""Grades the derived dataset roster in `_forks.py`.

The roster is what every sweeping test keys its per-fork census on, so a roster
that has quietly stopped describing the tree turns those censuses into totals
over the wrong corpus. That already happened once: Brainstorm exported into
`exported_powers/brainstorm/` while four tests still pruned a two-name literal,
and the two whose pins were floors rather than equalities kept passing with
Brainstorm's rows filed under Homecoming.

The check that earns its place is the last one. A dataset arriving with no test
updated is the failure mode, and an unrostered tree under the export root is the
first observable sign of it.

Run directly:  python3 tools/bin-crawler/tests/test_export_roster.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import _forks

_failures: list[str] = []


def check(condition, message):
    if not condition:
        _failures.append(message)


def test_the_roster_describes_the_tree():
    """Every registered dataset has a tree, one sits at the root, none is stray."""
    for failure in _forks.roster_failures():
        check(False, failure)


def test_the_roster_is_not_vacuous():
    """A roster that derived to nothing would prune nothing and sweep everything."""
    check(len(_forks.DATASETS) >= 3,
          f"only {len(_forks.DATASETS)} dataset(s) derived from {_forks.SOURCES}")
    check(len(_forks.NESTED) == len(_forks.DATASETS) - 1,
          f"{len(_forks.NESTED)} nested tree(s) for {len(_forks.DATASETS)} datasets; "
          "exactly one dataset may sit at the export root")


def test_the_sweeping_tests_share_this_roster():
    """No sweeping test may rebuild the roster from a literal.

    This is the guard that would have caught Brainstorm. A test that spells its
    own fork list is correct only until the next dataset, and it fails silently
    when its pins are floors.
    """
    here = os.path.dirname(os.path.abspath(__file__))
    offenders = []
    for name in sorted(os.listdir(here)):
        if not name.startswith("test_") or not name.endswith(".py"):
            continue
        with open(os.path.join(here, name), encoding="utf-8") as handle:
            text = handle.read()
        if "exported_powers" not in text:
            continue
        if not any(w in text for w in ("os.walk", "rglob", "iglob", "glob(")):
            continue
        if "_forks" in text:
            continue
        # A literal roster: names a nested fork tree without deriving it.
        if '"rebirth"' in text or "'rebirth'" in text:
            offenders.append(name)
    check(not offenders,
          f"{offenders} walk the export tree on a hand-written fork list; "
          "import _forks and use FORKS / NESTED_DIRS instead")


if __name__ == "__main__":
    for _name, _fn in sorted(globals().items()):
        if _name.startswith("test_") and callable(_fn):
            _fn()
    if _failures:
        for failure in _failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        sys.exit(1)
    print(f"OK — {len(_forks.DATASETS)} datasets rostered from assets_sources.json "
          f"({_forks.ROOT_DATASET} at the export root), every sweeping test shares them.")
