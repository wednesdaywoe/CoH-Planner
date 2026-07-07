"""Powers-exporter source fingerprint — the anchor of the export-staleness guard.

`exported_powers/<dataset>/` is produced by the Python bin parser reading the
gitignored `.pigg` archives. CI has neither the archives nor Python, so unlike
`src/data/datasets/*/generated/` (which regenerates from committed
`exported_powers/`), the powers export CANNOT be regenerate-and-diffed in CI.

The failure this closes: a change to the parser (e.g. `_powers.py`) that ships
WITHOUT a matching re-export, so the committed JSON is stale relative to the
parser and every downstream fix is inert. It bit twice (the 2026-07-06 tspy
hybrid relabel; and earlier the incarnate converter regenerating one dataset).

The guard: `export_powers.py` stamps each dataset's output dir with a manifest
recording this fingerprint — a hash of the powers-exporter SOURCE at export
time. A JS/vitest guard (`src/data/export-staleness.test.ts`) recomputes the
same hash from the committed sources and asserts every dataset's manifest
matches. If the parser changed but a dataset was not re-exported, its recorded
fingerprint diverges from the current source and the guard goes red; the only
way to make it green is to actually re-export (which re-stamps).

Scope: the fingerprint covers the POWERS exporter surface — every `.py` under
`parser/` plus `export_powers.py`. It is a directory GLOB, not a curated
allowlist (the project keeps burning on hand-maintained allowlists), so it is
self-maintaining as parser files come and go. It intentionally OVER-covers:
`parser/_entities.py` / `parser/_salvage.py` feed the separate entity/salvage
exporters and don't affect the powers tree, so editing them forces a harmless
powers re-export (near-zero diff) rather than risking a silent miss. The
entity/salvage trees are not yet manifest-guarded (they never bit us); a
parallel manifest can be added the same way if that changes.

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


def _fingerprint_files(pkg_root: Path) -> list[Path]:
    """The powers-exporter source set: parser/**/*.py + export_powers.py."""
    files = [p for p in sorted((pkg_root / "parser").rglob("*.py"))
             if "__pycache__" not in p.parts]
    files.append(pkg_root / "export_powers.py")
    return files


def parser_fingerprint(pkg_root: Path | None = None) -> str:
    """Return the sha256 hex of the powers-exporter source tree.

    Deterministic: files are keyed by their POSIX path relative to `bin_crawler`
    and folded in sorted-relpath order as `relpath\\0<bytes>\\0`.
    """
    root = pkg_root or _PKG_ROOT
    entries = []
    for f in _fingerprint_files(root):
        rel = f.relative_to(root).as_posix()
        entries.append((rel, f.read_bytes()))
    entries.sort(key=lambda e: e[0])
    h = hashlib.sha256()
    for rel, data in entries:
        h.update(rel.encode("utf-8"))
        h.update(b"\0")
        h.update(data)
        h.update(b"\0")
    return h.hexdigest()


if __name__ == "__main__":
    print(parser_fingerprint())
