#!/usr/bin/env python3
"""Export player-relevant power data from Homecoming bins as structured JSON.

Generates CoD2-compatible JSON files organized as:
  output_dir/category/powerset/power.json

Only exports the 34 player-relevant categories (out of 204 total),
filtering out NPC/critter/pet data.

Usage:
  py -3 export_powers.py [--bin-dir G:/Homecoming/assets/live/bin] [--output-dir ./exported_powers]
"""

import argparse
import json
import os
import sys
from dataclasses import asdict
from pathlib import Path

# Allow running directly as a script: add the enclosing tools/bin-crawler/
# directory to sys.path so `bin_crawler` is importable.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from bin_crawler.parser._powers import parse_powers
from bin_crawler.parser._powersets import parse_powersets
from bin_crawler.parser._powercats import parse_powercats
from bin_crawler.parser._messages import load_messages
from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._enums import POWER_TYPE, EFFECT_AREA, TARGET_TYPE, PVP_FLAG


# Categories containing player-usable powers
PLAYER_CATEGORIES = {
    # Standard AT primary/secondary
    'Blaster_Ranged', 'Blaster_Support',
    'Brute_Defense', 'Brute_Melee',
    'Controller_Buff', 'Controller_Control',
    'Corruptor_Buff', 'Corruptor_Ranged',
    'Defender_Buff', 'Defender_Ranged',
    'Dominator_Assault', 'Dominator_Control',
    'Mastermind_Buff', 'Mastermind_Summon',
    'Scrapper_Defense', 'Scrapper_Melee',
    'Sentinel_Defense', 'Sentinel_Ranged',
    'Stalker_Defense', 'Stalker_Melee',
    'Tanker_Defense', 'Tanker_Melee',
    # Kheldians
    'Peacebringer_Defensive', 'Peacebringer_Offensive',
    'Warshade_Defensive', 'Warshade_Offensive',
    # VEATs
    'Arachnos_Soldiers', 'Widow_Training', 'Teamwork',
    # Pools, Epic, Inherent
    'Pool', 'Epic', 'Inherent',
    # Incarnate
    'Incarnate',
    # Redirects (pseudo-pet damage sources)
    'Redirects',
}


def format_duration(seconds: float) -> str:
    """Format duration as '120 seconds' or '0 seconds'."""
    if seconds == 0:
        return "0 seconds"
    if seconds == int(seconds):
        return f"{int(seconds)} seconds"
    return f"{seconds:.2f} seconds"


def power_to_dict(pw, msgs=None) -> dict:
    """Convert a PowerRecord to CoD2-compatible JSON dict."""
    d = {
        'name': pw.power_name,
        'full_name': pw.full_name,
        'short_name': pw.power_name,
        'type': POWER_TYPE.get(pw.power_type, f'Unknown({pw.power_type})'),
        'display_name': pw.display_name,
        'display_fullname': pw.full_name.replace('.', ' ').replace('_', ' ') if '.' in pw.full_name else pw.display_name,
        'display_help': pw.display_help,
        'display_short_help': pw.short_help,
        'icon': pw.icon.lower().replace('.tga', '.png') if pw.icon else '',
        'auto_issue': pw.auto_issue,
        'auto_issue_keeps_level': pw.auto_issue_keeps_level,
        'accuracy': round(pw.accuracy, 6),
        'effect_area': EFFECT_AREA.get(pw.effect_area, f'Unknown({pw.effect_area})'),
        'max_targets_hit': pw.max_targets_hit,
        'radius': pw.radius,
        'arc': pw.arc,
        'range': pw.range,
        'range_secondary': pw.range_secondary,
        'activation_time': round(pw.time_to_activate, 4),
        'recharge_time': round(pw.recharge_time, 4),
        'activate_period': round(pw.activate_period, 4),
        'endurance_cost': round(pw.endurance_cost, 4),
        'interrupt_time': round(pw.interrupt_time, 4),
        'target_type': TARGET_TYPE.get(pw.target_type, f'Unknown({pw.target_type})'),
        'target_type_secondary': TARGET_TYPE.get(pw.target_type_secondary, None),
        'targets_autohit': [TARGET_TYPE.get(v, f'Unknown({v})') for v in pw.targets_autohit],
        'targets_affected': [TARGET_TYPE.get(v, f'Unknown({v})') for v in pw.targets_affected],
        'boosts_allowed': pw.boosts_allowed,
        'allowed_boostset_cats': pw.allowed_boostset_cats,
        'cast_through': pw.cast_through,
        'num_allowed': pw.num_allowed,
        'requires': pw.requires,
        'activate_requires': pw.activate_requires,
        'target_requires': pw.target_requires,
        'attack_types': pw.attack_types,
    }

    # Effects (recursive — each effect group can have nested child groups,
    # which the convert script reads as `child_effects`).
    def _eg_to_dict(eg):
        out = {
            'chance': eg.chance,
            'ppm': eg.ppm,
            'delay': eg.delay,
            'radius_inner': eg.radius_inner,
            'radius_outer': eg.radius_outer,
            'requires_expression': eg.requires_expression,
            'flags': eg.flags,
            'is_pvp': eg.is_pvp,
            'eval_flags': eg.eval_flags,
            'templates': [],
        }
        for t in eg.templates:
            tmpl_dict = {
                'attribs': t.attribs,
                'type': t.type,
                'application_type': t.application_type,
                'aspect': t.aspect,
                'target': t.target,
                'table': t.table,
                'scale': round(t.scale, 6),
                'duration': format_duration(t.duration),
                'magnitude': t.magnitude,
                'delay': t.delay,
                'duration_expression': t.duration_expression,
                'magnitude_expression': t.magnitude_expression,
                'application_period': t.application_period,
                'tick_chance': t.tick_chance,
                'tick_mag_multiplier': t.tick_mag_multiplier,
                'tick_mag_additive': t.tick_mag_additive,
                'jit_requires': t.jit_requires,
                'caster_stack': t.caster_stack,
                'stack': t.stack,
                'stack_limit': t.stack_limit,
                'stack_key': t.stack_key,
            }
            if t.params:
                tmpl_dict['params'] = t.params
            out['templates'].append(tmpl_dict)
        children = getattr(eg, 'child_groups', None) or []
        if children:
            out['child_effects'] = [_eg_to_dict(c) for c in children]
        return out

    d['effects'] = [_eg_to_dict(eg) for eg in pw.effects]
    if pw.activation_effects:
        d['activation_effects'] = [_eg_to_dict(eg) for eg in pw.activation_effects]

    return d


def main():
    ap = argparse.ArgumentParser(description='Export player power data as structured JSON')
    ap.add_argument('--assets-dir', default=r'G:\Homecoming\assets\live',
                    help='Path to assets directory (with .pigg files or bin/ subdir)')
    ap.add_argument('--output-dir', default=None,
                    help='Output directory for JSON files (default: ./exported_powers/<assets-dir-name>, e.g. ./exported_powers/live or ./exported_powers/experimental)')
    ap.add_argument('--categories', nargs='*',
                    help='Specific categories to export (default: all player categories)')
    args = ap.parse_args()

    if args.output_dir is None:
        source_name = Path(args.assets_dir).name or 'export'
        output_dir = Path('./exported_powers') / source_name
    else:
        output_dir = Path(args.output_dir)
    categories = set(args.categories) if args.categories else PLAYER_CATEGORIES

    resolver = BinResolver(args.assets_dir)
    print(f'Source: {resolver.source_description}', flush=True)

    # Load message table
    msgs = None
    if resolver.has('clientmessages-en.bin'):
        print('Loading message table...', flush=True)
        msgs = load_messages(resolver.read('clientmessages-en.bin'))
        print(f'  {len(msgs)} messages loaded.', flush=True)

    # Parse powers
    print('Parsing powers.bin...', flush=True)
    all_powers = parse_powers(resolver.read('powers.bin'))
    print(f'  {len(all_powers)} powers loaded.', flush=True)

    # Resolve P-hashes
    if msgs:
        for pw in all_powers:
            pw.display_name = msgs.resolve(pw.display_name)
            pw.display_help = msgs.resolve(pw.display_help)
            pw.short_help = msgs.resolve(pw.short_help)

    # Parse powersets for available_level info
    ps_records = []
    ps_available = {}  # full_name -> available_level
    if resolver.has('powersets.bin'):
        print('Parsing powersets.bin...', flush=True)
        ps_records = parse_powersets(resolver.read('powersets.bin'))
        for ps in ps_records:
            for pw_name, avail in zip(ps.powers, ps.available):
                key = f"{ps.key}.{pw_name}"
                ps_available[key] = avail
        print(f'  {len(ps_records)} powersets loaded.', flush=True)

    # Filter to player categories
    player_powers = [pw for pw in all_powers if pw.category in categories]
    print(f'\nFiltered to {len(player_powers)} player powers from {len(categories)} categories.')

    # Group by category/powerset
    grouped: dict[str, dict[str, list]] = {}
    for pw in player_powers:
        cat = pw.category
        ps = pw.powerset
        grouped.setdefault(cat, {}).setdefault(ps, []).append(pw)

    # Write output
    total_files = 0
    for cat in sorted(grouped):
        for ps in sorted(grouped[cat]):
            ps_dir = output_dir / cat.lower() / ps.lower()
            ps_dir.mkdir(parents=True, exist_ok=True)

            powers_in_set = grouped[cat][ps]

            # Write index.json for the powerset
            # Find matching powerset record
            ps_key = f"{cat}.{ps}"
            ps_rec = next((r for r in ps_records if r.key == ps_key), None)

            # Sort powers by their position in the powerset's power list (game order)
            if ps_rec and ps_rec.powers:
                ps_order = {name: i for i, name in enumerate(ps_rec.powers)}
                powers_in_set.sort(key=lambda pw: ps_order.get(pw.power_name, 999))

            index_data = {
                'key': ps_key,
                'display_name': ps_rec.display_name if ps_rec else ps,
                'help': ps_rec.help if ps_rec else '',
                'short_help': ps_rec.short_help if ps_rec else '',
                'icon': (ps_rec.icon.lower().replace('.tga', '.png') if ps_rec and ps_rec.icon else ''),
                'powers': [pw.power_name for pw in powers_in_set],
                'available_level': [ps_available.get(f"{ps_key}.{pw.power_name}", 0) for pw in powers_in_set],
            }

            if msgs and ps_rec:
                index_data['display_name'] = msgs.resolve(index_data['display_name'])
                index_data['help'] = msgs.resolve(index_data['help'])
                index_data['short_help'] = msgs.resolve(index_data['short_help'])

            with open(ps_dir / 'index.json', 'w') as f:
                json.dump(index_data, f, indent=2)
            total_files += 1

            # Write individual power files
            for pw in powers_in_set:
                pw_dict = power_to_dict(pw, msgs)
                pw_dict['available_level'] = ps_available.get(f"{ps_key}.{pw.power_name}", 0)
                pw_dict['powerset'] = ps_key

                fname = pw.power_name.lower() + '.json'
                with open(ps_dir / fname, 'w') as f:
                    json.dump(pw_dict, f, indent=2)
                total_files += 1

    print(f'\nExported {total_files} files to {output_dir}/')
    print(f'  Categories: {len(grouped)}')
    print(f'  Powersets: {sum(len(ps) for ps in grouped.values())}')
    print(f'  Powers: {len(player_powers)}')


if __name__ == '__main__':
    main()
