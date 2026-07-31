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

from bin_crawler.assets_dir import resolve_dir


SCRIPT_DIR = Path(__file__).resolve().parent
EXPORT_SCRIPT = SCRIPT_DIR / 'export_powers.py'
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


# --- Deep (effect-level) diff -------------------------------------------
#
# shallow_diff only reports THAT `effects` changed, which is useless for a
# balance pass. The deep diff pairs individual effect templates by IDENTITY
# rather than by array position: a patch that inserts one template would
# otherwise shift every later index and report the whole power as rewritten.
#
# A power is modelled as a flat list of atomic effects (docs/COH-DATA-MODEL.md),
# so templates are flattened out of their group/child_effects nesting and
# matched across the whole power. `is_pvp` rides in the identity because a
# PvE/PvP pair is otherwise indistinguishable (and has been clobbered before).

TEMPLATE_ID_FIELDS = ('attribs', 'aspect', 'table', 'target',
                      'type', 'application_type', 'stack_key')

TEMPLATE_VALUE_FIELDS = ('scale', 'magnitude', 'duration', 'delay',
                         'application_period', 'tick_chance',
                         'tick_mag_multiplier', 'tick_mag_additive',
                         'stack', 'stack_limit', 'caster_stack', 'flags_raw',
                         'duration_expression', 'magnitude_expression',
                         'jit_requires')


def _flatten_templates(power: dict):
    """Yield (identity, template) for every template in a power, at any depth."""
    def walk(groups, is_pvp):
        for g in groups or []:
            pvp = g.get('is_pvp', is_pvp)
            for t in g.get('templates') or []:
                ident = (pvp,) + tuple(
                    tuple(t[f]) if isinstance(t.get(f), list) else t.get(f)
                    for f in TEMPLATE_ID_FIELDS)
                yield ident, t
            yield from walk(g.get('child_effects'), pvp)
    # is_pvp is a tri-state string ('EITHER' | 'PVE_ONLY' | 'PVP_ONLY'), not a
    # bool; child_effects inherit the parent group's value when absent.
    yield from walk(power.get('effects'), 'EITHER')


def _bucket(power: dict) -> dict[tuple, list[dict]]:
    out: dict[tuple, list[dict]] = {}
    for ident, t in _flatten_templates(power):
        out.setdefault(ident, []).append(t)
    return out


def deep_diff_power(a: dict, b: dict):
    """Compare one power's templates by identity.

    Returns (added, removed, changes) where changes is a list of
    (identity, field, old, new). Templates sharing an identity are paired in
    order; the surplus on either side counts as added/removed.
    """
    A, B = _bucket(a), _bucket(b)
    added, removed, changes = [], [], []
    for ident in set(A) | set(B):
        la, lb = A.get(ident, []), B.get(ident, [])
        for t in lb[len(la):]:
            added.append(ident)
        for t in la[len(lb):]:
            removed.append(ident)
        for ta, tb in zip(la, lb):
            for f in TEMPLATE_VALUE_FIELDS:
                if f in ta and f in tb and ta[f] != tb[f]:
                    changes.append((ident, f, ta[f], tb[f]))
    return added, removed, changes


def _ident_str(ident: tuple) -> str:
    pvp, attribs, aspect, table, target = ident[0], ident[1], ident[2], ident[3], ident[4]
    label = '/'.join(attribs) if attribs else '-'
    mode = '' if pvp in (None, 'EITHER') else f' ({pvp})'
    return f"{label} [{aspect} {table} ->{target}]{mode}"


def summarize_deep(left: dict[str, dict], right: dict[str, dict],
                   limit: int = 25) -> None:
    from collections import Counter
    common = set(left) & set(right)
    field_counts: Counter = Counter()
    per_power: list[tuple[str, int, int, int]] = []
    examples: dict[str, list] = {}
    added_ct: Counter = Counter()
    removed_ct: Counter = Counter()

    for k in sorted(common):
        added, removed, changes = deep_diff_power(left[k], right[k])
        if not (added or removed or changes):
            continue
        per_power.append((k, len(added), len(removed), len(changes)))
        for ident in added:
            added_ct[_ident_str(ident)] += 1
        for ident in removed:
            removed_ct[_ident_str(ident)] += 1
        for ident, f, old, new in changes:
            field_counts[f] += 1
            examples.setdefault(f, [])
            if len(examples[f]) < 6:
                examples[f].append((k, _ident_str(ident), old, new))

    print('\n=== Deep diff (templates paired by identity) ===')
    print(f'  Powers with effect-level changes: {len(per_power)}')
    print(f'  Templates added:   {sum(added_ct.values())}')
    print(f'  Templates removed: {sum(removed_ct.values())}')
    print(f'  Value changes:     {sum(field_counts.values())}')

    if field_counts:
        print('\n--- Changed template fields ---')
        for f, c in field_counts.most_common():
            print(f'  {c:6d}  {f}')
            for k, ident, old, new in examples[f][:3]:
                print(f'            {k}')
                print(f'              {ident}: {old!r} -> {new!r}')

    if added_ct:
        print(f'\n--- Most-added template identities ---')
        for ident, c in added_ct.most_common(limit):
            print(f'  {c:5d}  + {ident}')
    if removed_ct:
        print(f'\n--- Most-removed template identities ---')
        for ident, c in removed_ct.most_common(limit):
            print(f'  {c:5d}  - {ident}')

    if per_power:
        print(f'\n--- Powers by churn (top {limit}) ---')
        for k, a, r, c in sorted(per_power, key=lambda x: -(x[1] + x[2] + x[3]))[:limit]:
            print(f'  {k}: +{a} -{r} ~{c}')


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
    ap.add_argument('--assets-root', default=None,
                    help='Root containing <left>/ and <right>/. Omit to use the '
                         'remembered root or a folder picker.')
    ap.add_argument('--pick', action='store_true',
                    help='Open a folder picker to choose/change the assets root')
    ap.add_argument('--output-root', default=str(DEFAULT_OUTPUT_ROOT),
                    help=f'Root for JSON outputs (default: {DEFAULT_OUTPUT_ROOT})')
    ap.add_argument('--skip-export', action='store_true',
                    help='Skip running exports; diff existing output dirs')
    ap.add_argument('--deep', action='store_true',
                    help='Also diff inside effects, pairing templates by '
                         'identity instead of array position')
    ap.add_argument('--left-dir', default=None,
                    help='Diff an existing export tree directly (implies '
                         '--skip-export); pairs with --right-dir')
    ap.add_argument('--right-dir', default=None,
                    help='See --left-dir')
    args = ap.parse_args()

    # Direct tree-vs-tree mode: skips assets resolution entirely, so an
    # already-exported pair (or a committed tree) can be diffed as-is.
    if args.left_dir or args.right_dir:
        if not (args.left_dir and args.right_dir):
            sys.exit('ERROR: --left-dir and --right-dir must be given together')
        left = load_powers(Path(args.left_dir))
        right = load_powers(Path(args.right_dir))
        if not left or not right:
            sys.exit('ERROR: one or both sides are empty; check the paths.')
        summarize(args.left_dir, left, args.right_dir, right)
        if args.deep:
            summarize_deep(left, right)
        return

    # The assets ROOT holds two assets dirs (<left>/ and <right>/), so validate
    # that both halves look like assets dirs rather than the root itself.
    def _valid_root(p) -> bool:
        from bin_crawler.assets_dir import is_assets_dir
        root = Path(p)
        return root.is_dir() and is_assets_dir(root / args.left) and is_assets_dir(root / args.right)

    assets_root = Path(resolve_dir(
        args.assets_root,
        key='assets_root',
        title=f'Select the assets ROOT (the folder containing {args.left}/ and {args.right}/)',
        pick=args.pick,
        validate=_valid_root,
    ))
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
    if args.deep:
        summarize_deep(left, right)


if __name__ == '__main__':
    main()
