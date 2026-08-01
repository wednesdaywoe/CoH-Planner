"""Exporter source fingerprints — the anchor of the export-staleness guard.

`exported_powers/<dataset>/` (and its `tables/` subtree) is produced by the
Python bin parser reading the gitignored `.pigg` archives. CI has neither the
archives nor Python, so unlike `src/data/datasets/*/generated/` (which
regenerates from committed `exported_powers/`), these exports CANNOT be
regenerate-and-diffed in CI.

The failure this closes: a change to the parser (e.g. `_powers.py`,
`_classes.py`) that ships WITHOUT a matching re-export, so the committed JSON is
stale relative to the parser and every downstream fix is inert. The powers tree
bit twice (the 2026-07-06 tspy hybrid relabel; the incarnate converter
regenerating one dataset); the `tables/` tree was the WS3 gap — kept in sync
only because CLASSES-1 happened to regenerate it, guarded by nothing going
forward.

The guard: each exporter (`export_powers.py`, `export_classes.py`,
`export_entities.py`, `export_salvage.py`) stamps its output dir with a manifest
recording that exporter's SOURCE fingerprint at export time. A JS/vitest guard
(`src/data/export-staleness.test.ts`) recomputes
the same hash from the committed sources and asserts every dataset's manifest
matches. If the parser changed but a dataset was not re-exported, its recorded
fingerprint diverges from the current source and the guard goes red; the only
way to make it green is to actually re-export (which re-stamps).

Scope: each fingerprint covers ONE exporter surface — every `.py` under
`parser/` plus that exporter's entry module (`export_powers.py` for
`parser_fingerprint`, `export_classes.py` for `classes_fingerprint`,
`export_entities.py` for `entities_fingerprint`, `export_salvage.py` for
`salvage_fingerprint`). It is a directory GLOB, not a curated allowlist (the
project keeps burning on hand-maintained allowlists), so it is self-maintaining
as parser files come and go. It intentionally OVER-covers: the fingerprints
share the whole `parser/` glob, so a `_powers.py` edit also forces a harmless
classes/entities/salvage re-export and vice-versa (near-zero diff) — an accepted
trade for a self-maintaining glob. The salvage surface (`export_salvage.py` →
HC-only `exported_powers/salvage.json`, stamped alongside as
`salvage_export_manifest.json`) is HC-only: Rebirth/Thunderspy piggs carry no
`salvage.bin`, so those exports early-return and no manifest is written.

The manifest carries a second, independent record alongside these fingerprints:
`source`, the assets tree the bytes were read from (`BinResolver.provenance()`,
guarded by `src/data/export-provenance.test.ts`). A fingerprint says which
exporter ran; it cannot say what it was pointed at — DATA-GAP-REGISTER PROV-1.

The JS side (`export-staleness.test.ts`) MUST replicate this algorithm byte for
byte: sorted (posix-relpath-from-bin_crawler, file-bytes) folded into sha256 as
`relpath\0content\0` per file. Keep the two in lockstep — a divergence surfaces
loudly as a permanently-red guard, never a silent gap.
"""
from __future__ import annotations

import hashlib
from pathlib import Path

# Package root = the `bin_crawler` dir that contains parser/ and export_powers.py.
_PKG_ROOT = Path(__file__).resolve().parent


def _parser_py_files(pkg_root: Path) -> list[Path]:
    """Every `.py` under `parser/`, sorted, `__pycache__` excluded."""
    return [p for p in sorted((pkg_root / "parser").rglob("*.py"))
            if "__pycache__" not in p.parts]


def _fingerprint(pkg_root: Path, files: list[Path]) -> str:
    """sha256 hex of `files`, deterministic and order-independent.

    Files are keyed by their POSIX path relative to `bin_crawler` and folded in
    sorted-relpath order as `relpath\\0<bytes>\\0` — so the caller need not
    pre-sort `files`.
    """
    entries = [(f.relative_to(pkg_root).as_posix(), f.read_bytes()) for f in files]
    entries.sort(key=lambda e: e[0])
    h = hashlib.sha256()
    for rel, data in entries:
        h.update(rel.encode("utf-8"))
        h.update(b"\0")
        h.update(data)
        h.update(b"\0")
    return h.hexdigest()


def parser_fingerprint(pkg_root: Path | None = None) -> str:
    """sha256 of the powers-exporter source: parser/**/*.py + export_powers.py."""
    root = pkg_root or _PKG_ROOT
    return _fingerprint(root, _parser_py_files(root) + [root / "export_powers.py"])


def classes_fingerprint(pkg_root: Path | None = None) -> str:
    """sha256 of the classes-exporter source: parser/**/*.py + export_classes.py."""
    root = pkg_root or _PKG_ROOT
    return _fingerprint(root, _parser_py_files(root) + [root / "export_classes.py"])


def entities_fingerprint(pkg_root: Path | None = None) -> str:
    """sha256 of the entities-exporter source: parser/**/*.py + export_entities.py."""
    root = pkg_root or _PKG_ROOT
    return _fingerprint(root, _parser_py_files(root) + [root / "export_entities.py"])


def salvage_fingerprint(pkg_root: Path | None = None) -> str:
    """sha256 of the salvage-exporter source: parser/**/*.py + export_salvage.py."""
    root = pkg_root or _PKG_ROOT
    return _fingerprint(root, _parser_py_files(root) + [root / "export_salvage.py"])


if __name__ == "__main__":
    print(f"parser_fingerprint   {parser_fingerprint()}")
    print(f"classes_fingerprint  {classes_fingerprint()}")
    print(f"entities_fingerprint {entities_fingerprint()}")
    print(f"salvage_fingerprint  {salvage_fingerprint()}")
