#!/usr/bin/env python3
"""Effect-count parity sweep: exported_powers vs a CoD2 raw_data archive.

The independent-oracle diff from GAME-DATA-PRINCIPLES §5: our parser reads the same
powers.bin CoD2 reads, so a power where CoD2 has effect templates and our export has
zero is a silent parser drop (the class that hid the 265-power misalignment for months).

Deep-counts templates on BOTH sides (recursing child_effects, plus activation_effects)
to avoid the Dual Pistols false positive (nesting differences are not drops).

Classes reported, most to least alarming:
  ZERO_DROP      oracle has templates, export has 0            <- silent drop signal
  MISSING        power exists in oracle, absent from export    <- drop OR game drift
  COUNT_DELTA    both nonzero but unequal                      <- drift / CoD2 de-dup (informational)
  EXTRA          in export, not in oracle                      <- new content since archive date (fine)

Usage:
  python3 tools/data-audit/count_parity.py --oracle ~/Downloads/raw_data_homecoming-20251209_7415 \
      [--export exported_powers] [--json out.json]
"""
import argparse
import json
import sys
from pathlib import Path


def deep_template_count(power: dict) -> int:
    """Count effect templates recursively: effects[] + child_effects[] + activation_effects[]."""

    def count_groups(groups) -> int:
        total = 0
        for g in groups or []:
            if not isinstance(g, dict):
                continue
            total += len(g.get("templates") or [])
            total += count_groups(g.get("child_effects"))
        return total

    return count_groups(power.get("effects")) + count_groups(power.get("activation_effects"))


def walk_powers(root: Path):
    """Yield (relative_key, path) for every power JSON under root.

    Both trees use <category>/<powerset>/<power>.json; index.json files are structure,
    not powers. The export additionally has non-power dirs (tables/, entities/,
    redirects/) that have no oracle counterpart and are skipped for the match phase
    but reported in the census footer.
    """
    for p in sorted(root.rglob("*.json")):
        if p.name == "index.json":
            continue
        rel = p.relative_to(root).with_suffix("").as_posix().lower()
        yield rel, p


# tables/entities are non-power structure; rebirth/thunderspy are OTHER DATASETS nested
# under the same export root (the CoD2 oracle is HC-only — those two have no independent
# oracle and rely on parallel-converter diffs + the committed-export discipline instead).
NON_POWER_EXPORT_DIRS = {"tables", "entities", "rebirth", "thunderspy"}


def redirect_keys(power: dict) -> list:
    """Resolve a redirect-shell's targets to export-relative keys.

    'Redirects.Fiery_Aura.Phoenix_Rising_Concious' -> 'redirects/fiery_aura/phoenix_rising_concious'
    """
    keys = []
    for r in power.get("redirect") or []:
        name = r.get("name", "") if isinstance(r, dict) else str(r)
        parts = [p.lower() for p in name.split(".") if p]
        if parts:
            keys.append("/".join(parts))
    return keys


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--oracle", required=True, help="CoD2 raw_data archive root")
    ap.add_argument("--export", default="exported_powers")
    ap.add_argument("--json", help="write full machine-readable report here")
    args = ap.parse_args()

    oracle_root = Path(args.oracle).expanduser() / "powers"
    export_root = Path(args.export)
    if not oracle_root.is_dir():
        print(f"oracle powers/ dir not found: {oracle_root}", file=sys.stderr)
        return 2

    def load_counts(root: Path, skip_dirs=frozenset(), track_redirects=False):
        counts = {}
        redirects = {}
        unreadable = []
        for rel, path in walk_powers(root):
            top = rel.split("/", 1)[0]
            if top in skip_dirs:
                continue
            try:
                with open(path) as f:
                    data = json.load(f)
            except (json.JSONDecodeError, OSError) as e:
                unreadable.append((rel, str(e)))
                continue
            if not isinstance(data, dict):
                continue  # aggregate/list files are structure, not power records
            counts[rel] = deep_template_count(data)
            if track_redirects:
                rk = redirect_keys(data)
                if rk:
                    redirects[rel] = rk
        return counts, redirects, unreadable

    oracle, _, oracle_bad = load_counts(oracle_root)
    export, export_redirects, export_bad = load_counts(
        export_root, skip_dirs=NON_POWER_EXPORT_DIRS, track_redirects=True
    )

    zero_drop, shell_ok, missing, count_delta, extra = [], [], [], [], []
    for key, ocount in oracle.items():
        if key not in export:
            missing.append((key, ocount))
        elif export[key] == 0 and ocount > 0:
            # A 0-template power with redirects whose targets carry templates is a
            # redirect SHELL (converter follows it), not a parser drop.
            via_redirect = sum(export.get(t, 0) for t in export_redirects.get(key, []))
            if via_redirect > 0:
                shell_ok.append((key, ocount, via_redirect))
            else:
                zero_drop.append((key, ocount))
        elif export[key] != ocount:
            count_delta.append((key, ocount, export[key]))
    for key in export:
        if key not in oracle:
            extra.append(key)

    def by_category(rows, idx=0):
        cats = {}
        for row in rows:
            cats.setdefault(row[idx].split("/", 1)[0], []).append(row)
        return dict(sorted(cats.items(), key=lambda kv: -len(kv[1])))

    print(f"oracle powers: {len(oracle)}   export powers: {len(export)}")
    print(f"unreadable: oracle {len(oracle_bad)}, export {len(export_bad)}")
    print()
    print(f"ZERO_DROP (oracle has templates, export has 0, no live redirect): {len(zero_drop)}")
    for cat, rows in by_category(zero_drop).items():
        sample = ", ".join(r[0].rsplit("/", 1)[-1] for r in rows[:4])
        print(f"  {cat:<24} {len(rows):>5}   e.g. {sample}")
    print()
    print(f"REDIRECT_SHELL_OK (0 local templates, redirect targets carry them): {len(shell_ok)}")
    print()
    print(f"MISSING (in oracle, not in export): {len(missing)}")
    for cat, rows in by_category(missing).items():
        sample = ", ".join(r[0].rsplit("/", 1)[-1] for r in rows[:4])
        print(f"  {cat:<24} {len(rows):>5}   e.g. {sample}")
    print()
    print(f"COUNT_DELTA (both nonzero, unequal — drift/de-dup, informational): {len(count_delta)}")
    for cat, rows in list(by_category(count_delta).items())[:12]:
        print(f"  {cat:<24} {len(rows):>5}")
    print()
    print(f"EXTRA (export-only — content newer than the archive): {len(extra)}")

    if args.json:
        report = {
            "oracle_root": str(oracle_root),
            "totals": {"oracle": len(oracle), "export": len(export)},
            "zero_drop": [{"power": k, "oracle_templates": c} for k, c in zero_drop],
            "redirect_shell_ok": [
                {"power": k, "oracle": o, "via_redirect": v} for k, o, v in shell_ok
            ],
            "missing": [{"power": k, "oracle_templates": c} for k, c in missing],
            "count_delta": [
                {"power": k, "oracle": o, "export": e} for k, o, e in count_delta
            ],
            "extra": extra,
        }
        Path(args.json).write_text(json.dumps(report, indent=1))
        print(f"\nfull report -> {args.json}")

    # Exit 1 only on the silent-drop class; drift classes are informational.
    return 1 if zero_drop else 0


if __name__ == "__main__":
    sys.exit(main())
