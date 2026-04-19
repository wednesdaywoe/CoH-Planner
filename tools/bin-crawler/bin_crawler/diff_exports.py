#!/usr/bin/env python3
"""Run live + experimental exports and summarize the diff.

Usage:
  py -3 tools/bin-crawler/bin_crawler/diff_exports.py
  py -3 tools/bin-crawler/bin_crawler/diff_exports.py --skip-export   # reuse existing output
  py -3 tools/bin-crawler/bin_crawler/diff_exports.py --left live --right experimental
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
EXPORT_SCRIPT = SCRIPT_DIR / 'export_powers.py'
DEFAULT_ASSETS_ROOT = Path(r'G:\Homecoming\assets')
DEFAULT_OUTPUT_ROOT = Path('./exported_powers')


def run_export(assets_dir: Path, output_dir: Path) -> None:
    print(f'\n=== Exporting {assets_dir} -> {output_dir} ===', flush=True)
    result = subprocess.run(
        [sys.executable, str(EXPORT_SCRIPT),
         '--assets-dir', str(assets_dir),
         '--output-dir', str(output_dir)],
        check=False,
    )
    if result.returncode != 0:
        sys.exit(f'Export failed for {assets_dir} (exit {result.returncode})')


def load_powers(root: Path) -> dict[str, dict]:
    """Load all power JSONs keyed by 'category/powerset/power'."""
    powers: dict[str, dict] = {}
    if not root.exists():
        return powers
    for cat_dir in root.iterdir():
        if not cat_dir.is_dir():
            continue
        for ps_dir in cat_dir.iterdir():
            if not ps_dir.is_dir():
                continue
            for json_file in ps_dir.glob('*.json'):
                if json_file.name == 'index.json':
                    continue
                key = f'{cat_dir.name}/{ps_dir.name}/{json_file.stem}'
                try:
                    with open(json_file) as f:
                        powers[key] = json.load(f)
                except (json.JSONDecodeError, OSError) as e:
                    print(f'  WARN: could not read {json_file}: {e}')
    return powers


def shallow_diff(a: dict, b: dict) -> list[str]:
    """Return list of top-level field names whose values differ."""
    changed = []
    keys = set(a) | set(b)
    for k in sorted(keys):
        if a.get(k) != b.get(k):
            changed.append(k)
    return changed


def summarize(left_name: str, left: dict[str, dict],
              right_name: str, right: dict[str, dict]) -> None:
    left_keys = set(left)
    right_keys = set(right)

    added = sorted(right_keys - left_keys)
    removed = sorted(left_keys - right_keys)
    common = left_keys & right_keys

    changed: list[tuple[str, list[str]]] = []
    for k in sorted(common):
        fields = shallow_diff(left[k], right[k])
        if fields:
            changed.append((k, fields))

    print(f'\n=== Diff: {left_name} -> {right_name} ===')
    print(f'  {left_name}: {len(left_keys)} powers')
    print(f'  {right_name}: {len(right_keys)} powers')
    print(f'  Added   in {right_name}: {len(added)}')
    print(f'  Removed in {right_name}: {len(removed)}')
    print(f'  Changed: {len(changed)}')

    if added:
        print(f'\n--- Added ({len(added)}) ---')
        for k in added[:50]:
            print(f'  + {k}')
        if len(added) > 50:
            print(f'  ... and {len(added) - 50} more')

    if removed:
        print(f'\n--- Removed ({len(removed)}) ---')
        for k in removed[:50]:
            print(f'  - {k}')
        if len(removed) > 50:
            print(f'  ... and {len(removed) - 50} more')

    if changed:
        print(f'\n--- Changed ({len(changed)}) ---')
        # Show first 30 with the fields that differ
        for k, fields in changed[:30]:
            print(f'  ~ {k}: {", ".join(fields)}')
        if len(changed) > 30:
            print(f'  ... and {len(changed) - 30} more')

        # Field-frequency histogram across all changed powers
        from collections import Counter
        field_counts = Counter(f for _, fields in changed for f in fields)
        print(f'\n--- Most-changed fields ---')
        for field, count in field_counts.most_common(15):
            print(f'  {count:5d}  {field}')


def main():
    ap = argparse.ArgumentParser(description='Export live + experimental and diff')
    ap.add_argument('--left', default='live', help='Left assets subdir name (default: live)')
    ap.add_argument('--right', default='experimental', help='Right assets subdir name (default: experimental)')
    ap.add_argument('--assets-root', default=str(DEFAULT_ASSETS_ROOT),
                    help=f'Root containing <left>/ and <right>/ (default: {DEFAULT_ASSETS_ROOT})')
    ap.add_argument('--output-root', default=str(DEFAULT_OUTPUT_ROOT),
                    help=f'Root for JSON outputs (default: {DEFAULT_OUTPUT_ROOT})')
    ap.add_argument('--skip-export', action='store_true',
                    help='Skip running exports; diff existing output dirs')
    args = ap.parse_args()

    assets_root = Path(args.assets_root)
    output_root = Path(args.output_root)
    left_out = output_root / args.left
    right_out = output_root / args.right

    if not args.skip_export:
        run_export(assets_root / args.left, left_out)
        run_export(assets_root / args.right, right_out)

    print(f'\nLoading {left_out}...', flush=True)
    left = load_powers(left_out)
    print(f'Loading {right_out}...', flush=True)
    right = load_powers(right_out)

    if not left or not right:
        sys.exit('ERROR: one or both sides are empty. Run without --skip-export or check paths.')

    summarize(args.left, left, args.right, right)


if __name__ == '__main__':
    main()
