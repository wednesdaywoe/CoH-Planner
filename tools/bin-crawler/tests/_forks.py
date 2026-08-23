"""The dataset roster these tests sweep, derived instead of hand-listed.

Every test that walks `exported_powers/` used to carry its own copy of the fork
list, and Brainstorm landing broke four of them at once. It exports at
`exported_powers/brainstorm/`, so a Homecoming walk that prunes only `rebirth`
and `thunderspy` swallows it: two tests went red, and two kept passing while
counting Brainstorm's rows as Homecoming's.

Both halves come from data. The names come from `assets_sources.json`, which is
what the crawler itself sources datasets from. Which one sits at the export root
comes from the filesystem, since exactly one dataset has no subdirectory of its
own. A new dataset therefore arrives in both without an edit here.

`test_export_roster.py` grades the derivation. Use `FORKS` for the roots and
`NESTED` to prune a root walk; don't rebuild either from a literal.
"""

import json
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(_HERE, "..", "..", ".."))
EXPORT_ROOT = os.path.join(REPO, "exported_powers")
SOURCES = os.path.join(REPO, "tools", "bin-crawler", "bin_crawler", "assets_sources.json")


def _datasets():
    with open(SOURCES, encoding="utf-8") as handle:
        return tuple(json.load(handle)["datasets"])


DATASETS = _datasets()

# Nested by having a tree of its own. The remaining one is the export root.
NESTED = tuple(d for d in DATASETS if os.path.isdir(os.path.join(EXPORT_ROOT, d)))
_AT_ROOT = tuple(d for d in DATASETS if d not in NESTED)
ROOT_DATASET = _AT_ROOT[0] if len(_AT_ROOT) == 1 else None

FORKS = {
    d: (EXPORT_ROOT if d == ROOT_DATASET else os.path.join(EXPORT_ROOT, d))
    for d in DATASETS
}

# Directory names to prune when walking the root dataset's tree.
NESTED_DIRS = frozenset(NESTED)

# dataset -> its subdirectory under the export root, empty for the root dataset. The shape the
# sweeping tests want when they build a path per fork.
FORK_SUBDIR = {d: ("" if d == ROOT_DATASET else d) for d in DATASETS}

# Trees under the export root that belong to the root dataset rather than being
# datasets. They carry an `_export_manifest.json` like a fork root does, so the
# roster guard would otherwise read them as an unregistered dataset.
NON_DATASET_TREES = frozenset({"entities", "tables"})


def roster_failures():
    """Why the derivation can't be trusted, empty when it can.

    Shared by `test_export_roster.py` and by each sweeping test, so a test
    reading a roster that doesn't describe the tree says so instead of
    reporting a census over the wrong corpus.
    """
    failures = []
    if len(_AT_ROOT) != 1:
        failures.append(
            f"expected exactly one dataset at the export root, found {list(_AT_ROOT)}; "
            f"{SOURCES} and the exported_powers/ layout disagree"
        )
    for dataset, root in FORKS.items():
        if not os.path.isdir(root):
            failures.append(f"dataset {dataset!r} is registered but has no tree at {root}")
    marked = {
        name for name in os.listdir(EXPORT_ROOT)
        if os.path.isfile(os.path.join(EXPORT_ROOT, name, "_export_manifest.json"))
    }
    stray = sorted(marked - NESTED_DIRS - NON_DATASET_TREES)
    if stray:
        failures.append(
            f"{stray} look like exported datasets but no dataset in {SOURCES} names them. "
            f"A tree nobody rosters is swept as part of {ROOT_DATASET!r}"
        )
    return failures
