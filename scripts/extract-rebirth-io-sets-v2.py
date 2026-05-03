"""Extract Rebirth's full IO set library from the live game's bin files.

Replaces the older HC-filter approach (extract-rebirth-io-sets.cjs) with a
direct read from Rebirth's boostsets.bin + powers.bin. Produces
src/data/datasets/rebirth/io-sets-raw.ts.

Pipeline:
  1. Parse boostsets.bin → set metadata + BoostLists + Bonuses + levels
  2. For each piece (Boost power), look up powers.bin → derive aspects from
     effect-template attribs (damage types collapse to "Damage", etc.)
  3. For each bonus (Set_Bonus power), look up powers.bin → derive
     effects[] entries (stat key + value + display description)
  4. Resolve display strings via clientmessages-en.bin
  5. Emit TypeScript io-sets-raw

Usage:
    py -3 scripts/extract-rebirth-io-sets-v2.py
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

# Allow running from the project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / 'tools' / 'bin-crawler'))

from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._boostsets import parse_boostsets, EC_CATEGORY_TO_PLANNER, BoostSetRecord
from bin_crawler.parser._powers import parse_powers, PowerRecord
from bin_crawler.parser._messages import load_messages

REBIRTH_ASSETS = r'G:/Thunderspy Gaming/Sweet Tea/rebirth'
OUTPUT_PATH = PROJECT_ROOT / 'src' / 'data' / 'datasets' / 'rebirth' / 'io-sets-raw.ts'

# ---------------------------------------------------------------------
# Rarity → planner category
# ---------------------------------------------------------------------
EC_RARITY_TO_PLANNER = {
    'ECCommon':   'uncommon',
    'ECUncommon': 'uncommon',
    'ECRare':     'rare',
    'ECVeryRare': 'purple',
    'ECPvP':      'pvp',
    'ECPVP':      'pvp',
    'ECWinter':   'event',
    'ECSWinter':  'event',
    'ECHalloween':  'event',
    'ECSHalloween': 'event',
    'ECSummer':   'event',
    'ECATO':      'ato',
    'ECSATO':     'ato',
    'ECATO2':     'ato',
    'ECSATO2':    'ato',
    'ECUltraRare': 'purple',
    # Rebirth-specific oddballs
    'LibertysBelt':         'event',
    'ImperialMight':        'event',
    'ForcedIndoctrination': 'event',
}

# ---------------------------------------------------------------------
# Damage-type attribs that collapse into a single "Damage" aspect when
# all 8 are present. Boost pieces enhance every damage type at once.
# ---------------------------------------------------------------------
DAMAGE_ATTRIBS = {
    'Smashing_Dmg', 'Lethal_Dmg', 'Fire_Dmg', 'Cold_Dmg',
    'Energy_Dmg', 'Negative_Energy_Dmg', 'Toxic_Dmg', 'Psionic_Dmg',
}
# Resistance attribs same idea — all 8 → "Damage Resistance".
RESISTANCE_ATTRIBS = DAMAGE_ATTRIBS
# Mez attribs — all 5 of these → "Mez Resistance".
MEZ_ATTRIBS = {'Held', 'Stunned', 'Sleep', 'Confused', 'Terrorized', 'Immobilized'}

# Map of bin attrib → planner aspect label (for boost pieces).
ATTRIB_TO_ASPECT = {
    'Accuracy':           'Accuracy',
    'RechargeTime':       'Recharge',
    'EnduranceDiscount':  'Endurance',
    'Range':              'Range',
    'Knockback':          'Knockback',
    'Stunned':            'Stun',
    'Held':               'Hold',
    'Sleep':              'Sleep',
    'Confused':           'Confuse',
    'Terrorized':         'Fear',
    'Immobilized':        'Immobilize',
    'HitPoints':          'Healing',
    'Endurance':          'Endurance Modification',
    'ToHit':              'ToHit Buff',
    'DamageType':         'Damage',
    # Unknown indices we've seen in boost pieces — map to the most common
    # CoH boost-type meaning. These are heuristics; refine when the
    # binary parser maps them properly.
    'Unknown(85)':        'Endurance',     # EnduranceReduction in CoH attribs (typical)
    'Unknown(86)':        'Interrupt',
    'Unknown(116)':       None,            # Special / proc trigger — used as a marker
}


def _collapse_aspects(attribs: list[str]) -> tuple[list[str], bool]:
    """Collapse a piece's attribs into planner aspect labels.

    Returns (aspects, is_proc). is_proc=True when the piece carries a
    proc-marker attrib (Unknown(116) or similar).
    """
    aspects: list[str] = []
    is_proc = False
    distinct = set(attribs)

    if DAMAGE_ATTRIBS.issubset(distinct):
        aspects.append('Damage')
        distinct -= DAMAGE_ATTRIBS

    for a in sorted(distinct):
        mapped = ATTRIB_TO_ASPECT.get(a)
        if mapped is None:
            # Marker-only attrib (e.g. Unknown(116) for proc trigger).
            if a == 'Unknown(116)':
                is_proc = True
            continue
        if mapped not in aspects:
            aspects.append(mapped)

    return aspects, is_proc


def _piece_name_from_aspects(aspects: list[str]) -> str:
    """Build a piece display name from its aspects.

    "Accuracy/Damage", "Damage/Recharge", "Recharge/Chance for Resolve".
    """
    if not aspects:
        return 'Empty'
    return '/'.join(aspects)


# ---------------------------------------------------------------------
# Set_Bonus power → planner bonus effect entry
# ---------------------------------------------------------------------
# Stat key: planner uses snake_case names (defense, recharge, regen, etc.).
# We collapse multi-EG Set_Bonus powers into one effects[] entry per
# distinct (stat, scale) tuple, with a description built from the bin data.

ATTRIB_TO_BONUS_STAT = {
    # Damage attribs with aspect=Resistance → resistance to that type
    ('Fire_Dmg',           'Resistance'): 'fire_resistance',
    ('Cold_Dmg',           'Resistance'): 'cold_resistance',
    ('Smashing_Dmg',       'Resistance'): 'smashing_resistance',
    ('Lethal_Dmg',         'Resistance'): 'lethal_resistance',
    ('Energy_Dmg',         'Resistance'): 'energy_resistance',
    ('Negative_Energy_Dmg','Resistance'): 'negative_resistance',
    ('Psionic_Dmg',        'Resistance'): 'psionic_resistance',
    ('Toxic_Dmg',          'Resistance'): 'toxic_resistance',
    # Mez attribs with aspect=Resistance → mez resistance
    ('Held',         'Resistance'): 'hold_resistance',
    ('Stunned',      'Resistance'): 'stun_resistance',
    ('Sleep',        'Resistance'): 'sleep_resistance',
    ('Immobilized',  'Resistance'): 'immobilize_resistance',
    ('Terrorized',   'Resistance'): 'fear_resistance',
    ('Confused',     'Resistance'): 'confuse_resistance',
    # Defense by position (aspect=Current with table)
    ('Melee',        'Current'): 'defense_(melee)',
    ('Ranged',       'Current'): 'defense_(ranged)',
    ('Area',         'Current'): 'defense_(area)',
    ('Smashing',     'Current'): 'defense_(smashing)',
    ('Lethal',       'Current'): 'defense_(lethal)',
    ('Fire',         'Current'): 'defense_(fire)',
    ('Cold',         'Current'): 'defense_(cold)',
    ('Energy',       'Current'): 'defense_(energy)',
    ('Negative_Energy', 'Current'): 'defense_(negative)',
    ('Psionic',      'Current'): 'defense_(psionic)',
    # Common bonus stats
    ('HitPoints',    'Maximum'):  'maxhp',
    ('Endurance',    'Maximum'):  'maxendurance',
    ('Endurance',    'Strength'): 'recovery',
    ('HitPoints',    'Strength'): 'regeneration',
    ('Recovery',     'Strength'): 'recovery',
    ('Regeneration', 'Strength'): 'regeneration',
    ('RechargeTime', 'Strength'): 'recharge',
    ('Damage',       'Strength'): 'damage',
    ('ToHit',        'Strength'): 'tohit',
    ('Accuracy',     'Strength'): 'accuracy',
    ('PerceptionRadius', 'Current'): 'perception',
}


def _resolve_bonus_effects(set_bonus_power: PowerRecord) -> list[dict]:
    """Build the planner's bonus effects[] list from a Set_Bonus power's
    effect templates.

    Multi-template Set_Bonus powers (e.g. an 8-resistance Mez bonus) are
    grouped: identical scale + matching attrib categories collapse into
    a single description ("+2.5% Mez Res (Hold, Stun, ...)").
    """
    by_scale: dict[float, list[tuple[str, str]]] = {}  # scale → [(attrib, aspect), ...]
    for eg in set_bonus_power.effects:
        for t in eg.templates:
            for a in (t.attribs or []):
                by_scale.setdefault(round(t.scale, 6), []).append((a, t.aspect or ''))

    out: list[dict] = []
    for scale, pairs in by_scale.items():
        # Try to resolve the (attrib, aspect) → planner stat key
        stats = []
        for a, aspect in pairs:
            key = ATTRIB_TO_BONUS_STAT.get((a, aspect))
            if key:
                stats.append(key)
        if not stats:
            continue
        # Dedup, preserve order
        seen = set()
        unique_stats = [s for s in stats if not (s in seen or seen.add(s))]
        # Use the first stat as the primary; emit one effect per distinct stat.
        for stat in unique_stats:
            value_pct = round(scale * 100, 4)
            desc = f'+{value_pct}% {stat.replace("_", " ").title()}'
            out.append({'stat': stat, 'value': value_pct, 'desc': desc})
    return out


# ---------------------------------------------------------------------
# Main extraction
# ---------------------------------------------------------------------

def main() -> int:
    print(f'Loading Rebirth bins from {REBIRTH_ASSETS}…')
    resolver = BinResolver(REBIRTH_ASSETS)
    msgs_path = resolver.read_to_tempfile('clientmessages-en.bin')
    msgs = load_messages(msgs_path)
    print(f'  {len(msgs)} client messages loaded')

    sets = parse_boostsets(resolver.read('boostsets.bin'))
    print(f'  {len(sets)} boostsets parsed')

    print('Parsing powers.bin (large, ~30s)…')
    powers = parse_powers(resolver.read('powers.bin'))
    power_index: dict[str, PowerRecord] = {p.full_name: p for p in powers}
    print(f'  {len(powers)} power records indexed')

    # Build the io-sets-raw shape.
    # Match what's in src/data/datasets/homecoming/io-sets-raw.ts.
    out_sets: dict[str, dict] = {}
    skipped: list[str] = []
    for s in sets:
        rarity = EC_RARITY_TO_PLANNER.get(s.rarity)
        if not rarity:
            skipped.append(f'{s.name}: unmapped rarity {s.rarity!r}')
            continue
        type_ = EC_CATEGORY_TO_PLANNER.get(s.category, '')

        # Resolve display name via clientmessages.
        display = msgs._keys.get(s.display_name, '') if s.display_name else ''
        if not display:
            display = s.name.replace('_', ' ')

        # Build pieces.
        pieces = []
        for i, bl in enumerate(s.boostlists):
            # Pick the first boost variant — Crafted/Attuned share aspects.
            piece_power = None
            for boost_name in bl.boosts:
                pp = power_index.get(boost_name)
                if pp:
                    piece_power = pp
                    break
            if not piece_power:
                continue
            # Collect attribs across the piece's effect templates.
            attribs: list[str] = []
            for eg in piece_power.effects:
                for t in eg.templates:
                    if t.attribs:
                        attribs.extend(t.attribs)
            aspects, is_proc = _collapse_aspects(attribs)
            piece_display = _piece_name_from_aspects(aspects) or 'Special'
            if is_proc:
                # Proc pieces get a contextual "Chance for X" label later.
                # For now, "Recharge/Chance for Resolve" style if recharge present,
                # else "Chance for X".
                if 'Recharge' in aspects:
                    piece_display = f'Recharge/Chance'
                else:
                    piece_display = 'Chance'
            pieces.append({
                'num': i + 1,
                'name': piece_display,
                'aspects': aspects,
                'proc': is_proc,
                'unique': True,  # most modern IO pieces are unique; refine if needed
            })

        # Build bonuses.
        bonuses_out = []
        for bn in s.bonuses:
            for ap in bn.auto_powers:
                ap_power = power_index.get(ap) or power_index.get(f'Set_Bonus.Set_Bonus.{ap}')
                if not ap_power:
                    continue
                effects = _resolve_bonus_effects(ap_power)
                if effects:
                    # Use min_boosts as the threshold.
                    bonuses_out.append({
                        'pieces': bn.min_boosts,
                        'effects': effects,
                    })
                    break  # first matching auto-power per bonus tier

        # Build the set entry.
        set_id = s.name.lower().replace('-', '').replace('__', '_')
        out_sets[set_id] = {
            'name': display,
            'category': rarity,
            'type': type_,
            'minLevel': s.min_level or 1,
            'maxLevel': s.max_level or 50,
            'bonuses': bonuses_out,
            'pieces': pieces,
            'icon': f's{set_id}.png',
        }

    print(f'\nExtracted {len(out_sets)} sets ({len(skipped)} skipped)')
    for sk in skipped[:8]:
        print(f'  skip: {sk}')

    # Verify Guardian ATOs are present
    print('\nGuardian ATOs:')
    for k in ('guardians_gift', 'superior_guardians_gift', 'absolute_resolution', 'superior_absolute_resolution'):
        v = out_sets.get(k)
        if v:
            print(f'  {k}: {len(v["pieces"])} pieces, {len(v["bonuses"])} bonus tiers, type={v["type"]!r}')
        else:
            print(f'  {k}: MISSING')

    # Emit TS file
    header = f'''/**
 * Rebirth IO Set data — extracted from live Rebirth bins.
 *
 * Auto-generated by `scripts/extract-rebirth-io-sets-v2.py`. Do not hand-edit.
 *
 * Source: G:/Thunderspy Gaming/Sweet Tea/rebirth/z_rebirth_bin.pigg
 *   - boostsets.bin → set metadata + piece refs + bonus refs + levels
 *   - powers.bin    → boost-piece aspects (via Boosts.X.X power records)
 *                     and bonus values (via Set_Bonus.X.X power records)
 *   - clientmessages-en.bin → display name resolution
 *
 * Total sets: {len(out_sets)}
 * Includes Rebirth-only sets (Guardian's Gift, Absolute Resolution,
 * Halloween + Winter event sets, Liberty's Belt, etc.) that aren't in
 * HC's curated io-sets-raw.
 *
 * Bonus values are best-effort from the binary effect templates; some
 * descriptions are auto-generated and may need refinement to match the
 * in-game Mids/wiki phrasing exactly. Aspect / piece-name extraction is
 * heuristic — proc pieces show as "Chance" until we resolve their
 * specific labels via the chance-trigger attribs.
 */

interface LegacyIOSetPiece {{
  num: number;
  name: string;
  aspects: string[];
  proc: boolean;
  unique: boolean;
  totalAspects?: number;
}}

interface LegacySetBonusEffect {{
  stat: string;
  value: number;
  desc: string;
  pvp?: boolean;
}}

interface LegacySetBonus {{
  pieces: number;
  effects: LegacySetBonusEffect[];
}}

interface LegacyIOSet {{
  name: string;
  category: string;
  type: string;
  minLevel: number;
  maxLevel: number;
  bonuses: LegacySetBonus[];
  pieces: LegacyIOSetPiece[];
  icon: string;
}}

type LegacyIOSetRegistry = Record<string, LegacyIOSet>;

export const IO_SETS_RAW: LegacyIOSetRegistry = '''
    body = json.dumps(out_sets, indent=2, sort_keys=True)
    OUTPUT_PATH.write_text(header + body + ';\n', encoding='utf-8')
    print(f'\nWrote {OUTPUT_PATH}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
