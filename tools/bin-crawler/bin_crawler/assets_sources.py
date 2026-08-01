"""The canonical game-install tree for each dataset and ring.

Reads `assets_sources.json`, which is the single place a path lives. The
registry exists because a path typed at the command line is the one input
nothing downstream can check: an export from the wrong tree is internally
self-consistent, so it passes the staleness guard, converter validation and the
contract totals alike (DATA-GAP-REGISTER PROV-1). Naming trees instead of
typing paths removes the typo from the loop, and `src/data/export-provenance.test.ts`
holds every committed manifest to the path this registry names.

`--source <dataset>[:<ring>]` on each exporter resolves through here. Rings
other than `exportable_ring` resolve fine — reading the open beta to see what a
patch does is the point of having it — but the gate rejects an export STAMPED
with one, so a beta read cannot quietly become the committed tree.
"""
from __future__ import annotations

import json
from pathlib import Path

_REGISTRY_PATH = Path(__file__).resolve().parent / "assets_sources.json"


class UnknownSource(ValueError):
    """A dataset/ring the registry does not name, or a path it rejects."""


def _registry() -> dict:
    return json.loads(_REGISTRY_PATH.read_text())


def datasets() -> list[str]:
    return list(_registry()["datasets"])


def rings(dataset: str) -> list[str]:
    return list(_dataset(dataset)["rings"])


def _dataset(dataset: str) -> dict:
    known = _registry()["datasets"]
    if dataset not in known:
        raise UnknownSource(
            f"Unknown dataset {dataset!r}. Known: {', '.join(known)}"
        )
    return known[dataset]


def exportable_ring(dataset: str) -> str:
    """The one ring whose bytes may reach a committed export."""
    return _dataset(dataset)["exportable_ring"]


def resolve(source: str) -> tuple[str, str, str]:
    """Resolve ``<dataset>[:<ring>]`` to ``(dataset, ring, path)``.

    Defaults to the dataset's exportable ring, so `--source homecoming` means
    the tree users get.
    """
    dataset, _, ring = source.partition(":")
    ring = ring or exportable_ring(dataset)
    entry = _dataset(dataset)
    if ring not in entry["rings"]:
        raise UnknownSource(
            f"{dataset} has no ring {ring!r}. Known: {', '.join(entry['rings'])}"
        )
    return dataset, ring, entry["rings"][ring]["path"]


def rejection_reason(path: str | Path) -> str | None:
    """Why this tree must not be exported from, if the registry rejects it.

    Rejections are named rather than merely omitted because the traps here look
    like the real thing: Homecoming's `closedbeta` folder is not the closed beta
    (that is `experimental`), and the Sweet Tea `piggs` folder resolves
    `powers.bin` while holding an unrelated corpus.
    """
    resolved = Path(path).resolve().as_posix()
    for entry in _registry()["datasets"].values():
        for rejected, reason in entry.get("rejected_paths", {}).items():
            if Path(rejected).as_posix() == resolved:
                return reason
    return None


def canonical_path(dataset: str) -> str:
    """The path a committed export of `dataset` must have been read from."""
    return resolve(f"{dataset}:{exportable_ring(dataset)}")[2]


def dataset_for_path(path: str | Path) -> tuple[str, str] | None:
    """The ``(dataset, ring)`` this tree is, or None if the registry omits it."""
    resolved = Path(path).resolve().as_posix()
    for name, entry in _registry()["datasets"].items():
        for ring, ring_entry in entry["rings"].items():
            if Path(ring_entry["path"]).as_posix() == resolved:
                return name, ring
    return None
