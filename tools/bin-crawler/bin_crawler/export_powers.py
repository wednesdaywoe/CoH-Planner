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
import re
import sys
from dataclasses import asdict
from pathlib import Path

# Allow running directly as a script: add the enclosing tools/bin-crawler/
# directory to sys.path so `bin_crawler` is importable.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from bin_crawler.parser._powers import parse_powers
from bin_crawler.parser._powersets import parse_powersets
from bin_crawler.parser._powercats import parse_powercats
from bin_crawler.parser._classes import parse_classes
from bin_crawler.parser._boostsets import parse_boostsets, build_power_category_index
from bin_crawler.parser._messages import load_messages
from bin_crawler.parser._attrib_names import parse_mode_table, parse_stack_key_table
from bin_crawler.parser._pigg import BinResolver
from bin_crawler.assets_dir import resolve_assets_dir
from bin_crawler._export_fingerprint import parser_fingerprint
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
    # Rebirth Guardian — primary "Assault" sets and secondary "Composition"
    # sets (armor + utility). HC has no equivalent AT.
    'Guardian_Assault', 'Guardian_Comp',
    # Kheldians
    'Peacebringer_Defensive', 'Peacebringer_Offensive',
    'Warshade_Defensive', 'Warshade_Offensive',
    # Thunderspy Primalist — a custom Kheldian-style form-shifter AT. Primary
    # 'Feral_Might', secondary 'Primal_Gifts'; the Hunter/Prowler/Primal form
    # attack variants + per-attack lifesteal redirects live in 'Primalist_Misc'
    # (listed below with the Lore/NPC pet categories).
    #   GOTCHA: HC's powers.bin ALSO carries ~63 ORPHAN Primalist powers under
    #   these same name-prefixes — with NO backing powerset, powercat, or class.
    #   (The old comment here wrongly assumed they "won't exist" in HC; they do,
    #   and leaked into the HC export.) These categories are therefore gated at
    #   runtime by `_source_has_primalist_class` below: kept ONLY when the source
    #   actually defines a Primalist class (Thunderspy), dropped for HC/Rebirth.
    'Feral_Might', 'Primal_Gifts',
    # VEATs
    'Arachnos_Soldiers', 'Widow_Training', 'Teamwork',
    # VEAT Soldier secondaries: Training_and_Gadgets, Crab_Spider_Training,
    # Bane_Spider_Training. Without this category the Soldier secondary
    # picker is empty and branches reuse the primary as the secondary.
    'Training_Gadgets',
    # Pools, Epic, Inherent
    'Pool', 'Epic', 'Inherent',
    # Incarnate
    'Incarnate',
    # Redirects (pseudo-pet damage sources)
    'Redirects',
    # Aux categories: hold the actual AoE/hit data for leap/charge attacks
    # (Savage Leap, Feral Charge, etc.) referenced via Execute_Power.
    'Brute_Melee_Aux', 'Dominator_Assault_Aux', 'Scrapper_Melee_Aux',
    'Stalker_Melee_Aux', 'Tanker_Melee_Aux',
    # Pets categories — host the actual damage data for player powers that
    # delegate via top-level `redirect`. Snipes are the canonical case:
    # `Sniper_Blast` has zero effects and points at `Pets.Blaster_Energy_Snipe.
    # Sniper_Blast_Normal` / `_Quick` for its Normal vs fast-snipe variants.
    # The convert script's collectRedirectTemplates resolves these via
    # `pets/<set>/<power>.json`, so they need to be on disk.
    'Pets', 'Villain_Pets',
    # Mastermind henchman powers (Plasma_Blast, Smash, etc.) and the upgrade
    # tiers (`*_2`, `*_3` powersets). Without these, convert-pet-entities can't
    # resolve any MM henchman ability.
    'Mastermind_Pets',
    # Kheldian pets (Decoy, Dwarf, etc.) and NPC/Lore pets that incarnate
    # entities can grant.
    'Kheldian_Pets', 'NPC_Pets',
    # NPC/villain-group categories that Lore incarnate pets pull abilities
    # from (the pet "mimics" enemies of that group). The dominant ones by
    # entity reference count are Rularuu (146), Objects (22), and several
    # villain-group cats. Without these the pet-entity converter drops
    # Lore Support / Cimeroran / Banished / etc. variants.
    'Rularuu', 'Objects', 'Primalist_Misc', 'Signature_Summon',
    'Cabal', 'Council', 'V_Arachnos', 'DevouringEarth',
    'Mission_Maker_Attacks', 'Crey', 'RoguesGallery', 'GenericVillains',
    'Rikti', 'V_Wailers', 'CircleOfThorns', 'Clockwork', 'Vanguard',
    'V_Miscellaneous', 'PaladinEvent',
}


# Thunderspy-only Primalist categories. HC/Rebirth carry orphan powers under
# these prefixes (no powerset/powercat/class), so they must be gated on the
# source actually defining a Primalist class — see _source_has_primalist_class.
PRIMALIST_CATEGORIES = {'Feral_Might', 'Primal_Gifts', 'Primalist_Misc'}


def _source_has_primalist_class(resolver) -> bool:
    """True iff the source defines a Primalist archetype (Thunderspy).

    Used to decide whether the Primalist power categories are real player
    content (Thunderspy: wired to the Primalist class) or orphan leakage
    (HC/Rebirth: powers exist in powers.bin but no class/powerset references
    them). Checks both the hero and villain class tables.
    """
    for bin_name in ('classes.bin', 'villain_classes.bin'):
        if not resolver.has(bin_name):
            continue
        try:
            for c in parse_classes(resolver.read(bin_name)):
                if 'primalist' in (getattr(c, 'name', '') or '').lower():
                    return True
        except Exception:
            continue
    return False


def format_duration(seconds: float) -> str:
    """Format duration as '120 seconds' or '0 seconds'."""
    if seconds == 0:
        return "0 seconds"
    if seconds == int(seconds):
        return f"{int(seconds)} seconds"
    return f"{seconds:.2f} seconds"


def power_to_dict(pw, msgs=None, set_cats_index=None, mode_table=None,
                  stack_key_table=None) -> dict:
    """Convert a PowerRecord to CoD2-compatible JSON dict.

    set_cats_index maps `full_name` → list of planner set-category strings
    derived from boostsets.bin's authoritative per-set power lists.

    Three states for `allowed_set_categories` in the output:
      - List with entries: the game says these categories slot here.
      - Empty list `[]`: the game has the power in boostsets but it maps
        to nothing — strict "no IO sets here" (e.g., SR Quickness).
      - `null`: boostsets wasn't loaded *or* this power isn't in the
        index. Downstream converters should fall back to inference.

    The previous behavior conflated "boostsets says nothing" with "no
    boostsets at all", which made every Rebirth power look like a strict
    no-IO power on datasets where boostsets.bin wasn't shipped.
    """
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
        # TimeToRoot (Parse7 field 48b) — animation-lock duration. Emitted only
        # when nonzero: 0 means the .powers def omits it, and Parse6 datasets
        # (Rebirth/Thunderspy) don't serialize the field at all.
        **({'time_to_root': round(pw.time_to_root, 4)} if pw.time_to_root else {}),
        'recharge_time': round(pw.recharge_time, 4),
        'activate_period': round(pw.activate_period, 4),
        'endurance_cost': round(pw.endurance_cost, 4),
        'interrupt_time': round(pw.interrupt_time, 4),
        'target_type': TARGET_TYPE.get(pw.target_type, f'Unknown({pw.target_type})'),
        'target_type_secondary': TARGET_TYPE.get(pw.target_type_secondary, None),
        'targets_autohit': [TARGET_TYPE.get(v, f'Unknown({v})') for v in pw.targets_autohit],
        'targets_affected': [TARGET_TYPE.get(v, f'Unknown({v})') for v in pw.targets_affected],
        'boosts_allowed': pw.boosts_allowed,
        'allowed_set_categories': (
            # `set_cats_index.get(pw.full_name)` returns:
            #   list  — power found, empty list means "no sets" (strict)
            #   None  — power not in index OR no boostsets.bin loaded
            #           → emit null so downstream can infer.
            set_cats_index.get(pw.full_name) if set_cats_index else None
        ),
        'cast_through': pw.cast_through,
        'toggle_ignore': pw.toggle_ignore,
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
            # Effect Tag(s) — the global-chance-mod bucket (Dual Pistols ammo
            # tag groups, etc.). Captured so the converter can attribute
            # tag-gated effects to their mode instead of folding into base.
            'tags': getattr(eg, 'tags', []),
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
                # Resolve the StackKeys-registry ID (attrib_names.bin) to its
                # key name — 'TravelBuff', 'StealthToggle', etc. Falls back to
                # a stable 'Key<N>' placeholder when the registry is missing
                # or the ID is out of range, so suppress-group GROUPING stays
                # correct even unresolved. (The pre-2026-07 exports decoded
                # this field as a string offset, yielding garbage suffixes of
                # the string table's first entry: 'ictusFX' = TravelBuff.)
                'stack_key': (
                    (stack_key_table or {}).get(t.stack_key_id, f'Key{t.stack_key_id}')
                    if t.stack_key_id else None
                ),
            }
            if t.params:
                tmpl_dict['params'] = t.params
            # Cancel/suppress events from the AttribMod tail. Only emit when
            # non-empty to keep the JSON small (most templates have neither).
            if t.cancel_events:
                tmpl_dict['cancel_events'] = t.cancel_events
            if t.suppress_events:
                tmpl_dict['suppress_events'] = t.suppress_events
            # Decoded flag names (e.g. ["IgnoreStrength", "IgnoreResistance"])
            # plus the raw bitmask for any bits we haven't named yet.
            if t.flags:
                tmpl_dict['flags'] = t.flags
            if t.flags_raw:
                tmpl_dict['flags_raw'] = t.flags_raw
            if t.boost_mod_allowed_id:
                tmpl_dict['boost_mod_allowed_id'] = t.boost_mod_allowed_id
            # Resolve a Set_Mode template's opaque magnitude (a mode index) to
            # its mode name via attrib_names.bin, e.g. magnitude 46 -> mode
            # "Domination_Active", magnitude 1 -> "Peacebringer_Blaster_Mode"
            # (Bright Nova). Gated on magnitude >= 1: mode index 0 is the
            # ServerTrayOverride system slot (no gameplay meaning). The old
            # mag >= 2 gate was a workaround for the attrib-118 misdecode
            # (kXPDebtProtection / kSetCostume collapsing onto Set_Mode with a
            # placeholder magnitude of 1); that misdecode is now fixed at the
            # source (resolve_attrib), so genuine mode-1 sets resolve correctly.
            if mode_table and 'Set_Mode' in t.attribs:
                idx = int(round(t.magnitude))
                if idx >= 1:
                    mode = mode_table.get(idx)
                    if mode:
                        tmpl_dict['mode_name'] = mode
            out['templates'].append(tmpl_dict)
        children = getattr(eg, 'child_groups', None) or []
        if children:
            out['child_effects'] = [_eg_to_dict(c) for c in children]
        return out

    d['effects'] = [_eg_to_dict(eg) for eg in pw.effects]
    if pw.activation_effects:
        d['activation_effects'] = [_eg_to_dict(eg) for eg in pw.activation_effects]
    if pw.redirects:
        d['redirect'] = pw.redirects
    # ChainEff — per-jump chain-continue chance expression (e.g. Chain Induction,
    # Jolting Chain). Sparse (only chain powers), so emit only when present.
    if pw.chain_eff_expression:
        d['chain_eff_expression'] = pw.chain_eff_expression
    # ChainTarget — next-target selection weighting (Electrical Affinity circuits:
    # Rejuvenating/Energizing/Empowering/Insulating_Circuit, Chain_Lightning, …).
    # Parse7 field 43b; verified against the HC `.powers` oracle. Sparse.
    if pw.chain_target_expression:
        d['chain_target_expression'] = pw.chain_target_expression
    # MaxTargetsExpr — RPN target-cap (Gauntlet attacks, the circuits). Parse7
    # field 38 (HC-only); verified via GauntletTargetCap. Sparse.
    if pw.max_targets_expression:
        d['max_targets_expression'] = pw.max_targets_expression

    # Power-level mode gates (ModesRequired / ModesDisallowed / ModesSuspended)
    # resolved to mode names via the same registry Set_Mode magnitudes index.
    # These gate a power to/from a caster mode: `modes_required` fires it only
    # in those modes (Domination, Titan Weapons FastMode/Momentum, DP LethalAmmo
    # swaps, Primalist Hunter/Prowler forms), `modes_disallowed` blocks it, and
    # `modes_suspended` auto-detoggles it (Stone Armor toggles under Granite,
    # Kheldian travel powers in Blaster/Tanker forms). Resolved-and-sparse: only
    # emitted when non-empty; unresolved indices are dropped, and the whole block
    # is skipped when no mode table was loaded (non-HC sources) so raw per-server
    # indices never leak into the export. Mirrors `EffectTemplate.mode_name`.
    if mode_table:
        for field_name, idxs in (
            ('modes_required', pw.modes_required),
            ('modes_disallowed', pw.modes_disallowed),
            ('modes_suspended', pw.modes_suspended),
        ):
            names = [mode_table[i] for i in idxs if i in mode_table]
            if names:
                d[field_name] = names

    return d


def _collect_grant_targets(powers, prefix='temporary_powers.'):
    """Collect the dotted names a set of powers GRANT via `Grant_Power`
    templates, restricted to the given category prefix (default
    Temporary_Powers). Walks the full effect tree — top-level groups,
    child_groups, and activation_effects — since a grant can nest anywhere.
    Returns a set of lowercased full names.
    """
    targets: set[str] = set()

    def walk(groups):
        for g in groups or []:
            for t in getattr(g, 'templates', []) or []:
                attribs = getattr(t, 'attribs', None) or []
                if 'Grant_Power' not in attribs:
                    continue
                params = getattr(t, 'params', None) or {}
                for name in params.get('power_names') or []:
                    if name.lower().startswith(prefix):
                        targets.add(name.lower())
            walk(getattr(g, 'child_groups', None))

    for pw in powers:
        walk(getattr(pw, 'effects', None))
        walk(getattr(pw, 'activation_effects', None))
    return targets


def main():
    ap = argparse.ArgumentParser(description='Export player power data as structured JSON')
    ap.add_argument('--assets-dir', default=None,
                    help='Path to assets directory (with .pigg files or bin/ subdir). '
                         'Omit to use the remembered path or a folder picker.')
    ap.add_argument('--pick', action='store_true',
                    help='Open a folder picker to choose/change the assets directory')
    ap.add_argument('--output-dir', default=None,
                    help='Output directory for JSON files (default: ./exported_powers/<assets-dir-name>, e.g. ./exported_powers/live or ./exported_powers/experimental)')
    ap.add_argument('--categories', nargs='*',
                    help='Specific categories to export (default: all player categories)')
    args = ap.parse_args()

    assets_dir = resolve_assets_dir(args.assets_dir, pick=args.pick)

    if args.output_dir is None:
        source_name = Path(assets_dir).name or 'export'
        output_dir = Path('./exported_powers') / source_name
    else:
        output_dir = Path(args.output_dir)
    categories = set(args.categories) if args.categories else PLAYER_CATEGORIES

    resolver = BinResolver(assets_dir)
    print(f'Source: {resolver.source_description}', flush=True)

    # Source-aware Primalist gating: HC/Rebirth carry ORPHAN Primalist powers
    # (no powerset/powercat/class) that otherwise leak into the export via the
    # shared whitelist. Drop the Primalist categories unless this source defines
    # a Primalist class (Thunderspy). Skip when the user passed explicit
    # --categories (advanced override — respect their choice).
    if not args.categories:
        primalist_present = categories & PRIMALIST_CATEGORIES
        if primalist_present and not _source_has_primalist_class(resolver):
            categories = categories - PRIMALIST_CATEGORIES
            print(f'  No Primalist class in source — excluding orphan Primalist '
                  f'categories: {sorted(primalist_present)}', flush=True)

    # Load message table
    msgs = None
    if resolver.has('clientmessages-en.bin'):
        print('Loading message table...', flush=True)
        msgs = load_messages(resolver.read('clientmessages-en.bin'))
        print(f'  {len(msgs)} messages loaded.', flush=True)

    # Load the mode-name table (attrib_names.bin) used to resolve Set_Mode
    # template magnitudes (mode indices) to mode names. Per-server; absent on
    # some sources (Rebirth/Thunderspy piggs that don't ship attrib_names.bin),
    # in which case Set_Mode templates simply carry no `mode` field.
    mode_table = {}
    stack_key_table = {}
    if resolver.has('attrib_names.bin'):
        print('Loading mode table (attrib_names.bin)...', flush=True)
        _attrib_names_data = resolver.read('attrib_names.bin')
        mode_table = parse_mode_table(_attrib_names_data)
        print(f'  {len(mode_table)} modes loaded.', flush=True)
        # StackKeys registry from the same file — resolves each template's
        # stack_key ID to its suppress-group name (TravelBuff, StealthToggle…).
        stack_key_table = parse_stack_key_table(_attrib_names_data)
        print(f'  {len(stack_key_table)} stack keys loaded.', flush=True)

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
            # ps.powers contains full dotted names (Cat.Powerset.Power),
            # not just short names. Use them as the lookup keys directly.
            for pw_name, avail in zip(ps.powers, ps.available):
                ps_available[pw_name] = avail
        print(f'  {len(ps_records)} powersets loaded.', flush=True)

    # Parse boostsets.bin — the authoritative per-IO-set list of powers each
    # set can slot into. Reversed into a power→categories index so every
    # exported power gets its `allowed_set_categories` directly from the
    # game's data rather than inference.
    set_cats_index: dict[str, list[str]] = {}
    if resolver.has('boostsets.bin'):
        print('Parsing boostsets.bin...', flush=True)
        boost_sets = parse_boostsets(resolver.read('boostsets.bin'))
        set_cats_index = build_power_category_index(boost_sets)
        print(f'  {len(boost_sets)} IO sets loaded, '
              f'{len(set_cats_index)} powers indexed.', flush=True)

    # Filter to player categories
    player_powers = [pw for pw in all_powers if pw.category in categories]
    print(f'\nFiltered to {len(player_powers)} player powers from {len(categories)} categories.')

    # Referenced-target inclusion: pull in the Temporary_Powers powers that a
    # player power GRANTS via a `Grant_Power` template. These host effects the
    # granting power delivers but does not carry inline — most notably the
    # damage-over-time procs a few passives/toggles grant (Molten Embrace's Fire
    # DoT lives in Temporary_Powers.Temporary_Powers.Molten_Embrace_Proc, NOT in
    # Molten Embrace itself). Temporary_Powers as a whole is 1200+ travel/
    # accolade/event temps we don't want; only the powers actually referenced by
    # a player power's grant are relevant, so include exactly those (mirrors how
    # the Pets/*_Aux categories host Execute_Power/redirect damage targets, but
    # scoped to references instead of the whole category). The convert-time
    # resolver reads these by their dotted name; convert-all-powersets never
    # turns Temporary_Powers into a powerset (not in its category map), so these
    # are pure resolver data.
    if not args.categories:
        grant_targets = _collect_grant_targets(player_powers)
        by_full = {pw.full_name.lower(): pw for pw in all_powers}
        already = {pw.full_name.lower() for pw in player_powers}
        added = []
        for tgt in sorted(grant_targets):
            if tgt in already:
                continue
            pw = by_full.get(tgt)
            if pw is not None:
                player_powers.append(pw)
                added.append(pw)
        if added:
            print(f'  +{len(added)} referenced Grant_Power targets '
                  f'(Temporary_Powers grant hosts).', flush=True)

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

            # Sort powers by their position in the powerset's power list (game order).
            # ps_rec.powers items are full dotted names (Cat.Powerset.Power), so key
            # the order map and the sort lookup on pw.full_name — earlier code keyed
            # on pw.power_name (leaf), which never matched, leaving powers_in_set in
            # powers.bin natural (alphabetical) order and breaking same-level ties
            # like Single_Shot/Charged_Shot in HC blast sets.
            if ps_rec and ps_rec.powers:
                ps_order = {name: i for i, name in enumerate(ps_rec.powers)}
                powers_in_set.sort(key=lambda pw: ps_order.get(pw.full_name, 999))

            index_data = {
                'key': ps_key,
                'display_name': ps_rec.display_name if ps_rec else ps,
                'help': ps_rec.help if ps_rec else '',
                'short_help': ps_rec.short_help if ps_rec else '',
                'icon': (ps_rec.icon.lower().replace('.tga', '.png') if ps_rec and ps_rec.icon else ''),
                # Emit full dotted names ("Cat.Powerset.Power") so downstream
                # consumers (e.g. the planner converter) can use suffix-match
                # against the per-power short name.
                'powers': [pw.full_name for pw in powers_in_set],
                'available_level': [ps_available.get(pw.full_name, 0) for pw in powers_in_set],
                # Parallel arrays of per-power display info — convenience for
                # consumers that don't want to load every power file just to
                # build a slot index (e.g. src/data/incarnates.ts).
                'power_display_names': [pw.display_name for pw in powers_in_set],
                'power_short_helps': [pw.short_help for pw in powers_in_set],
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
                pw_dict = power_to_dict(pw, msgs, set_cats_index=set_cats_index,
                                        mode_table=mode_table,
                                        stack_key_table=stack_key_table)
                pw_dict['available_level'] = ps_available.get(pw.full_name, 0)
                pw_dict['powerset'] = ps_key

                # Power names containing characters invalid in Windows
                # filenames (`:`, `/`, `\`, etc.) need sanitizing.
                # `Combat_Training:_Defensive` → `combat_training_defensive.json`.
                # The convert script's index.json lookup is by full power
                # name string, so the filename mismatch is benign there;
                # this just lets the file actually write.
                safe_name = re.sub(r'[<>:"/\\|?*]+', '_', pw.power_name).lower()
                # Collapse runs of underscores from the substitution.
                safe_name = re.sub(r'_+', '_', safe_name).strip('_')
                fname = safe_name + '.json'
                with open(ps_dir / fname, 'w') as f:
                    json.dump(pw_dict, f, indent=2)
                total_files += 1

    print(f'\nExported {total_files} files to {output_dir}/')
    print(f'  Categories: {len(grouped)}')
    print(f'  Powersets: {sum(len(ps) for ps in grouped.values())}')
    print(f'  Powers: {len(player_powers)}')

    # Stamp the export-staleness manifest. This records the fingerprint of the
    # powers-exporter SOURCE that produced this tree, so a later parser change
    # that ships without a matching re-export is caught by the JS/vitest guard
    # (src/data/export-staleness.test.ts) — CI can't re-run this Python export
    # (no .pigg) so the fingerprint is the only cross-check. See
    # bin_crawler/_export_fingerprint.py. Skip when the user exported a category
    # SUBSET (`--categories`): a partial tree must not claim whole-dataset
    # currency, and stamping the current fingerprint over stale sibling
    # categories would defeat the guard.
    if not args.categories:
        manifest = {
            'schema': 'bin-crawler-export-manifest/1',
            'note': ('parser_fingerprint is the sha256 of the powers exporter '
                     '(bin_crawler/parser/**/*.py + export_powers.py) at export '
                     'time. If it disagrees with the current committed exporter '
                     'source, THIS tree is stale — re-run export_powers for this '
                     'dataset and commit. Guarded by '
                     'src/data/export-staleness.test.ts.'),
            'parser_fingerprint': parser_fingerprint(),
            'categories': len(grouped),
            'power_files': total_files,
        }
        with open(output_dir / '_export_manifest.json', 'w') as f:
            json.dump(manifest, f, indent=2)
            f.write('\n')
        print(f'  Manifest: parser_fingerprint={manifest["parser_fingerprint"][:12]}…')
    else:
        print('  Manifest: SKIPPED (partial --categories export; not stamping '
              'whole-dataset currency)')


if __name__ == '__main__':
    main()
