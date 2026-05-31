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
from bin_crawler.parser._boostsets import parse_boostsets, EC_CATEGORY_TO_PLANNER, BoostSetRecord, _resolve_category
from bin_crawler.parser._powers import parse_powers, PowerRecord
from bin_crawler.parser._messages import load_messages

REBIRTH_ASSETS = r'G:/Thunderspy Gaming/Sweet Tea/rebirth'
OUTPUT_PATH = PROJECT_ROOT / 'src' / 'data' / 'datasets' / 'rebirth' / 'io-sets-raw.ts'
HC_IO_SETS_PATH = PROJECT_ROOT / 'src' / 'data' / 'datasets' / 'homecoming' / 'io-sets-raw.ts'


def _load_hc_sets() -> dict[str, dict]:
    """Build a setId -> full-set-entry map from HC's io-sets-raw.ts.

    HC's data has hand-curated piece names ("Accuracy/Damage", etc.) that
    match Mids exports verbatim, plus complete bonus tiers. The Rebirth
    binary extraction loses Accuracy aspects on many pieces and produces
    auto-generated names that don't match Mids strings.

    For sets that exist in both servers, reuse HC's entry directly.
    Rebirth-only sets fall back to the binary-extracted entry.

    Returns a dict mapping set_id -> parsed JSON object (the full set body).
    """
    if not HC_IO_SETS_PATH.exists():
        return {}
    text = HC_IO_SETS_PATH.read_text(encoding='utf-8')
    sets: dict[str, dict] = {}
    set_pattern = re.compile(r'^  "([a-z0-9_]+)": (\{)', re.MULTILINE)
    for m in set_pattern.finditer(text):
        set_id = m.group(1)
        # Find the matching closing brace for this top-level set object.
        depth = 0
        i = m.start(2)
        end = -1
        in_string = False
        escape = False
        while i < len(text):
            c = text[i]
            if escape:
                escape = False
            elif c == '\\' and in_string:
                escape = True
            elif c == '"':
                in_string = not in_string
            elif not in_string:
                if c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break
            i += 1
        if end < 0:
            continue
        body = text[m.start(2):end]
        # HC's io-sets-raw.ts is TS object syntax, not strict JSON: it allows
        # trailing commas. Strip them so json.loads can parse.
        body_clean = re.sub(r',(\s*[\]\}])', r'\1', body)
        try:
            sets[set_id] = json.loads(body_clean)
        except json.JSONDecodeError:
            continue
    return sets

# ---------------------------------------------------------------------
# Curated icon overrides for Rebirth-only sets.
# Files were copied from MRB into public/img/Enhancements/{Archetype,Event,IO Sets}.
# These names override the auto-generated `s{set_id}.png` fallback.
# ---------------------------------------------------------------------
ICON_OVERRIDES = {
    # Guardian ATOs (Archetype/)
    'guardians_gift':                  "AO_Guardian's_Gift.png",
    'superior_guardians_gift':         "SAO_Guardian's_Gift.png",
    'absolute_resolution':             'AO_Absolute_Resolution.png',
    'superior_absolute_resolution':    'SAO_Absolute_Resolution.png',
    # Halloween event sets (Event/)
    'the_haunting':                    'EO_The_Haunting.png',
    'superior_the_haunting':           'SEO_The_Haunting.png',
    'endless_nightmare':               'EO_Endless_Nightmare.png',
    'superior_endless_nightmare':      'SEO_Endless_Nightmare.png',
    'vampires_bite':                   'EO_Vampires_Bite.png',
    'superior_vampires_bite':          'SEO_Vampires_Bite.png',
    'witchcraft':                      'EO_Witchcraft.png',
    'superior_witchcraft':             'SEO_Witchcraft.png',
    'return_from_the_grave':           'EO_Return_From_The_Grave.png',
    'superior_return_from_the_grave':  'SEO_Return_From_The_Grave.png',
    # Winter event sets (Event/)
    'winter_storm':                    'EO_Winter_Storm.png',
    'superior_winter_storm':           'SEO_Winter_Storm.png',
    'winters_gift':                    'SEO_Winters_Gift.png',
    # Misc Rebirth-only (IO Sets/)
    'forced_indoctrination':           'ForcedIndoctrination.png',
    'imperial_might':                  'ImperialMight.png',
    'inexhaustibility':                'Inexhaustibility.png',
    'libertys_belt':                   'Libertys_Belt.png',
    'rolling_barrage':                 'Rolling_Barrage.png',
    'synapses_agility':                'PowerOfSynapse.png',
}

# ---------------------------------------------------------------------
# Curated piece data for Rebirth-only sets.
# The binary extraction loses Accuracy aspects on many ATO pieces; Mids
# exports use the standard ATO piece-name convention. Provide hand-curated
# pieces so legacy "Set: Piece" Mids imports resolve correctly.
# ---------------------------------------------------------------------
def _ato_pieces(proc_name: str) -> list[dict]:
    return [
        {'num': 1, 'name': 'Accuracy/Damage',
         'aspects': ['Accuracy', 'Damage'], 'proc': False, 'unique': True},
        {'num': 2, 'name': 'Damage/RechargeTime',
         'aspects': ['Damage', 'Recharge'], 'proc': False, 'unique': True},
        {'num': 3, 'name': 'Accuracy/Damage/RechargeTime',
         'aspects': ['Accuracy', 'Damage', 'Recharge'], 'proc': False, 'unique': True},
        {'num': 4, 'name': 'Damage/Endurance/RechargeTime',
         'aspects': ['Damage', 'Endurance', 'Recharge'], 'proc': False, 'unique': True},
        {'num': 5, 'name': 'Accuracy/Damage/Endurance/RechargeTime',
         'aspects': ['Accuracy', 'Damage', 'Endurance', 'Recharge'], 'proc': False, 'unique': True},
        {'num': 6, 'name': proc_name,
         'aspects': ['Recharge'], 'proc': True, 'unique': True},
    ]

PIECE_OVERRIDES = {
    'guardians_gift':               _ato_pieces('RechargeTime/Chance for PBAoE Resolve'),
    'superior_guardians_gift':      _ato_pieces('RechargeTime/Chance for PBAoE Resolve'),
    'absolute_resolution':          _ato_pieces('RechargeTime/Chance for Energy Damage Bonus'),
    'superior_absolute_resolution': _ato_pieces('RechargeTime/Chance for Energy Damage Bonus'),
}

# Rebirth renamed individual proc pieces from HC's naming. Applied after
# the shared-HC override so the Rebirth-specific label wins.
# Format: set_id → {piece_num: new_name}
REBIRTH_PIECE_RENAMES = {
    'ragnarok': {6: 'Chance for Knockdown'},
}

# Per-piece aspect overrides for cases where the binary template carries
# attribs that don't match the in-game piece per the Rebirth wiki / in-game
# enhancement window. Each entry replaces the parsed aspect list outright
# (after `_collapse_aspects` runs) — the piece name is regenerated from the
# overridden list.
#
# Forced Indoctrination piece 5: binary template includes
# `EnduranceDiscount/Strength` alongside Acc/Dmg/Rech/mez, but the wiki and
# in-game tooltip describe this as Acc/Dmg/Rech/Ctrl (no End Reduction).
# Tracking the upstream discrepancy via this override so the planner shows
# what the player actually slots; revisit if Rebirth changes the binary.
REBIRTH_PIECE_ASPECT_OVERRIDES: dict[str, dict[int, list[str]]] = {
    'forced_indoctrination': {
        5: ['Accuracy', 'Damage', 'Recharge', 'Mez'],
    },
}

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
    'ECSpeedRun':           'event',
    '':                     'event',
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
# Mez attribs — all 6 of these → "Mez" (universal mez aspect, matches
# Controller / Dominator ATO convention in Will of the Controller etc.).
# Without the collapse, Forced Indoctrination's pieces would surface as
# "Damage/Confuse/Fear/Hold/Immobilize/Sleep/Stun" — accurate but unwieldy.
# Recognised as "Mez" by the planner's universal-mez expansion (every mez
# type gets the same Schedule A value, see UNIVERSAL_MEZ_KEYS in
# enhancement-values.ts).
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
    # Note: index 85 (Accuracy on Rebirth) and 116 (Create_Entity on Rebirth)
    # are now mapped in ATTRIB_NAME_REBIRTH, so the parser surfaces them
    # under their real names and these `Unknown(N)` keys never fire. Kept
    # here only as a safety net in case the parser regresses.
    'Unknown(85)':        'Accuracy',      # Rebirth's Accuracy slot (HC: 84)
    'Unknown(86)':        'Interrupt',
    'Unknown(116)':       None,            # Special / proc trigger — used as a marker
}


def _collapse_aspects(attribs: list[str], set_category: str = '') -> tuple[list[str], bool]:
    """Collapse a piece's attribs into planner aspect labels.

    Returns (aspects, is_proc). is_proc=True when the piece carries a
    proc-marker attrib (Unknown(116) or similar). Aspects are returned
    in CoH community order (Accuracy, Damage, Endurance, Recharge, then
    others) so the generated piece names match HC's hand-curated entries
    and Mids exports — "Accuracy/Damage" not "Damage/Accuracy".

    `set_category` is the boostset's EC* category (e.g. "ECResist", "ECMelee").
    In CoH, boost pieces with the 8 damage-type attribs always have
    aspect=Strength in the binary — the slotted power decides which
    "Strength" scalar that buffs. For a Resist Damage set (ECResist) the
    relevant scalar is the power's resistance scale, so the planner should
    label those pieces "Damage Resistance" rather than "Damage" to match
    HC's hand-curated convention (Aegis, Impervium Armor, etc.).
    """
    aspects: list[str] = []
    is_proc = False
    distinct = set(attribs)

    if DAMAGE_ATTRIBS.issubset(distinct):
        aspects.append('Damage Resistance' if set_category == 'ECResist' else 'Damage')
        distinct -= DAMAGE_ATTRIBS

    if MEZ_ATTRIBS.issubset(distinct):
        aspects.append('Mez')
        distinct -= MEZ_ATTRIBS

    for a in sorted(distinct):
        mapped = ATTRIB_TO_ASPECT.get(a)
        if mapped is None:
            if a == 'Unknown(116)':
                is_proc = True
            continue
        if mapped not in aspects:
            aspects.append(mapped)

    return _sort_aspects_canonical(aspects), is_proc


# CoH community / Mids canonical piece-name ordering. The four most-
# common attack-IO aspects come first in this fixed order; anything
# else (procs, exotic mez aspects) follows alphabetically. Used by
# `_collapse_aspects` so a piece carrying {Damage, Accuracy} surfaces
# as "Accuracy/Damage" — matching how HC's hand-curated data names
# them and how players reference them in Mids exports.
_ASPECT_CANONICAL_ORDER = ['Accuracy', 'Damage', 'Damage Resistance', 'Endurance', 'Recharge']


def _sort_aspects_canonical(aspects: list[str]) -> list[str]:
    canonical = [a for a in _ASPECT_CANONICAL_ORDER if a in aspects]
    rest = sorted(a for a in aspects if a not in _ASPECT_CANONICAL_ORDER)
    return canonical + rest


# Map proc-effect attribs to short human-readable labels for piece
# naming. These are NOT enhancement aspects (which use Strength) — they
# describe what the proc does when it triggers. Damage types get
# collapsed by category in `_proc_effect_labels` below.
_PROC_EFFECT_LABEL = {
    'Terrorized':         'Fear',
    'Held':               'Hold',
    'Stunned':            'Stun',
    'Sleep':              'Sleep',
    'Confused':           'Confuse',
    'Immobilized':        'Immobilize',
    'HitPoints':          'Heal',
    'Endurance':          'Endurance',
    'Recovery':           '+Recovery',
    'Regeneration':       '+Regeneration',
    'Smashing_Dmg':       'Smashing Damage',
    'Lethal_Dmg':         'Lethal Damage',
    'Fire_Dmg':           'Fire Damage',
    'Cold_Dmg':           'Cold Damage',
    'Energy_Dmg':         'Energy Damage',
    'Negative_Energy_Dmg': 'Negative Energy Damage',
    'Toxic_Dmg':          'Toxic Damage',
    'Psionic_Dmg':        'Psionic Damage',
    'Heal_Dmg':           'Heal',
    'Create_Entity':      'Resurrect',  # Negative-scale Create_Entity = resurrect proc on RFtG-style sets
}


def _proc_effect_labels(attribs: list[str]) -> list[str]:
    """Build short labels describing what a proc piece does when it
    triggers. Used to surface "Recharge/Chance for Fear, Psionic Damage"
    instead of a bare "Recharge/Chance". Deduplicates while preserving
    insertion order so the binary order shows through.
    """
    seen: set[str] = set()
    out: list[str] = []
    for a in attribs:
        label = _PROC_EFFECT_LABEL.get(a)
        if not label or label in seen:
            continue
        seen.add(label)
        out.append(label)
    return out


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
    ('Range',        'Strength'): 'range',
    ('PerceptionRadius', 'Current'): 'perception',
    # ----- All 8 damage types × Strength collapse to a single "+X% Damage" bonus.
    # Rebirth (and HC) encode "+X% Damage" as 8 parallel templates, one per
    # damage type, all aspect=Strength. Dedup in _resolve_bonus_effects
    # squashes the 8 entries into one "damage" effect.
    ('Smashing_Dmg',        'Strength'): 'damage',
    ('Lethal_Dmg',          'Strength'): 'damage',
    ('Fire_Dmg',            'Strength'): 'damage',
    ('Cold_Dmg',            'Strength'): 'damage',
    ('Energy_Dmg',          'Strength'): 'damage',
    ('Negative_Energy_Dmg', 'Strength'): 'damage',
    ('Toxic_Dmg',           'Strength'): 'damage',
    ('Psionic_Dmg',         'Strength'): 'damage',
    # Healing-strength bonus (Heal_Dmg attrib carries healing-buff scale).
    ('Heal_Dmg',     'Strength'): 'healing_strength',
    # Rebirth's alternate Recovery/Regen encoding. HC uses
    # ('Endurance','Strength') / ('HitPoints','Strength'); Rebirth's
    # Set_Bonus powers carry them as the dedicated Recovery/Regeneration
    # attribs with aspect=Current. Both map to the same planner stats.
    ('Recovery',     'Current'):  'recovery',
    ('Regeneration', 'Current'):  'regeneration',
    # Endurance reduction buff (rare but present on some Rebirth sets).
    ('EnduranceDiscount', 'Strength'): 'endurance_discount',
    # Mez duration buffs — extend the duration of YOUR mez attacks on
    # enemies. Per-type (no collapse): each maps to a distinct stat.
    ('Confused',     'Strength'): 'confuse_duration',
    ('Held',         'Strength'): 'hold_duration',
    ('Stunned',      'Strength'): 'stun_duration',
    ('Immobilized',  'Strength'): 'immobilize_duration',
    ('Sleep',        'Strength'): 'sleep_duration',
    ('Terrorized',   'Strength'): 'terror_duration',
    # All 4 movement-speed attribs collapse to a single "+X% Increased
    # Movement" bonus (Rebirth, like HC, encodes this as 4 parallel
    # templates). Both Current and Strength aspects appear.
    ('RunningSpeed', 'Current'):  'increased_movement',
    ('FlyingSpeed',  'Current'):  'increased_movement',
    ('JumpingSpeed', 'Current'):  'increased_movement',
    ('JumpHeight',   'Current'):  'increased_movement',
    ('RunningSpeed', 'Strength'): 'increased_movement',
    ('FlyingSpeed',  'Strength'): 'increased_movement',
    ('JumpingSpeed', 'Strength'): 'increased_movement',
    ('JumpHeight',   'Strength'): 'increased_movement',
    # Movement debuff (slow) resistance.
    ('RunningSpeed', 'Resistance'): '+res(slow)',
    ('FlyingSpeed',  'Resistance'): '+res(slow)',
    # Recharge debuff resistance.
    ('RechargeTime', 'Resistance'): '+res(recharge_debuff)',
    # Knockback protection (magnitude points).
    ('Knockback',    'Current'):  'knockback_protection',
    ('Knockup',      'Current'):  'knockback_protection',
    # Knockback strength buff.
    ('Knockback',    'Strength'): 'knockback_strength',
    ('Knockup',      'Strength'): 'knockback_strength',
}

# (attrib, aspect) tuples that should be ignored entirely — not bonuses,
# just power-state metadata that happens to appear in Set_Bonus effect
# templates. Suppresses noise in the unmapped-pairs diagnostic.
_BONUS_LOOKUP_IGNORE: set[tuple[str, str]] = {
    ('Set_Mode', 'Absolute'),
}

# Populated during _resolve_bonus_effects when a (attrib, aspect) tuple
# has no entry in ATTRIB_TO_BONUS_STAT. Printed at end-of-run so the next
# silently-dropped bonus surfaces immediately instead of vanishing.
_UNMAPPED_BONUS_PAIRS: dict[tuple[str, str], int] = {}


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
            # Diagnostic: record what we dropped so a missing mapping
            # doesn't silently swallow a real bonus tier next time.
            for a, aspect in pairs:
                if (a, aspect) in _BONUS_LOOKUP_IGNORE:
                    continue
                _UNMAPPED_BONUS_PAIRS[(a, aspect)] = _UNMAPPED_BONUS_PAIRS.get((a, aspect), 0) + 1
            continue
        # Dedup, preserve order
        seen = set()
        unique_stats = [s for s in stats if not (s in seen or seen.add(s))]
        # Use the first stat as the primary; emit one effect per distinct stat.
        for stat in unique_stats:
            value_pct = round(scale * 100, 4)
            # Knockback protection is stored as a negative-magnitude attrib
            # in the binary (-3 scale = +3 mag of resistance to KB). The
            # planner's calc engine expects the positive "+400 = 4 mag"
            # convention HC's hand-curated data uses, so flip the sign here.
            if stat == 'knockback_protection':
                value_pct = abs(value_pct)
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

    hc_sets = _load_hc_sets()
    print(f'  {len(hc_sets)} HC sets loaded for shared-set fallback')

    # Build the io-sets-raw shape.
    # Match what's in src/data/datasets/homecoming/io-sets-raw.ts.
    out_sets: dict[str, dict] = {}
    skipped: list[str] = []
    for s in sets:
        rarity = EC_RARITY_TO_PLANNER.get(s.rarity)
        if not rarity:
            skipped.append(f'{s.name}: unmapped rarity {s.rarity!r}')
            continue
        # _resolve_category applies the same rarity/name overrides used by
        # build_power_category_index for the per-power allowedSetCategories,
        # so the IO-set `type` field and the per-power match keys agree
        # (notably the Rebirth Challenge sets — Forced Indoctrination ->
        # "Universal Control Duration", Inexhaustibility -> "Rest Buff").
        type_ = _resolve_category(s)

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
            # Collect enhancement-aspect attribs across the piece's effect
            # templates, separating proc-trigger markers and proc-effect
            # templates from the enhancement aspects.
            #
            # Enhancement aspects (Recharge, Accuracy, Sleep, Hold, ...) always
            # use aspect=Strength — they buff that stat's effectiveness on the
            # slotted power. Proc effects (apply X when triggered) use Current
            # or Absolute. Proc trigger markers also use Current/Absolute and
            # match specific (attrib, aspect, scale) signatures observed in
            # Rebirth (verified on Endless Nightmare, Witchcraft, Vampire's
            # Bite, The Haunting, Guardian's Gift, etc.):
            #   - Create_Entity × Current × |scale|=1.0   (ATO + summon procs)
            #   - Null × Absolute × scale=1.0             (Halloween procs)
            # On HC the proc marker surfaces as Unknown(116) and is handled
            # by `_collapse_aspects`; Rebirth's index 116 is named
            # Create_Entity per ATTRIB_NAME_REBIRTH, so we detect it here at
            # the template level instead.
            attribs: list[str] = []
            proc_effect_attribs: list[str] = []  # Attribs from proc-effect templates (used for piece naming)
            is_proc_marker = False
            for eg in piece_power.effects:
                for t in eg.templates:
                    if not t.attribs:
                        continue
                    if len(t.attribs) == 1 and abs(abs(t.scale) - 1.0) < 0.01:
                        a0 = t.attribs[0]
                        if a0 == 'Create_Entity' and t.aspect == 'Current':
                            is_proc_marker = True
                            continue
                        if a0 == 'Null' and t.aspect == 'Absolute':
                            is_proc_marker = True
                            continue
                    # Enhancement aspects use Strength. Templates with other
                    # aspects (Current/Absolute) are proc effects.
                    if t.aspect == 'Strength':
                        attribs.extend(t.attribs)
                    else:
                        proc_effect_attribs.extend(t.attribs)
            aspects, is_proc = _collapse_aspects(attribs, s.category)
            is_proc = is_proc or is_proc_marker
            # Fallback proc detection: when the piece has NO Strength
            # templates (no enhancement aspects to collapse) but DOES carry
            # Current/Absolute templates with damage-type attribs, it's a
            # bare proc piece — the damage template itself is the effect.
            # Forced Indoctrination piece 6 is the canonical case: a single
            # Psionic_Dmg/Absolute/Magnitude template with no Null marker
            # alongside it. Without this branch, _collapse_aspects sees an
            # empty attrib list and the piece exports as `name="Empty"`.
            if not is_proc and not attribs and proc_effect_attribs:
                is_proc = True
            piece_display = _piece_name_from_aspects(aspects) or 'Special'
            if is_proc:
                # Build a "Chance for X" label using whatever proc effects
                # we saw (Terrorized -> Fear, Psionic_Dmg -> Psionic Damage,
                # Create_Entity for resurrection/summon procs, etc.). Falls
                # back to a bare "Chance" / "Recharge/Chance" when the binary
                # offers no readable effect attribs.
                effect_labels = _proc_effect_labels(proc_effect_attribs)
                effect_phrase = ', '.join(effect_labels)
                if 'Recharge' in aspects:
                    piece_display = f'Recharge/Chance for {effect_phrase}' if effect_phrase else 'Recharge/Chance'
                else:
                    piece_display = f'Chance for {effect_phrase}' if effect_phrase else 'Chance'
            # Authoritative unique flag: the piece's `slot_requires`
            # contains a `BoostsSlotted>X <= 0` constraint when the game
            # enforces uniqueness for that piece (purples, ATOs, ATIO
            # globals, etc.). Empty / level-only slot_requires means the
            # piece is freely slottable across multiple powers.
            slot_req = (piece_power.slot_requires or '').lower()
            is_unique = 'boostsslotted>' in slot_req
            pieces.append({
                'num': i + 1,
                'name': piece_display,
                'aspects': aspects,
                'proc': is_proc,
                'unique': is_unique,
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
            'icon': ICON_OVERRIDES.get(set_id) or (hc_sets.get(set_id, {}).get('icon')) or f's{set_id}.png',
        }

    # Override shared sets with HC's hand-curated entry. HC piece names
    # match Mids exports verbatim (e.g. "Accuracy/Damage"); the binary
    # extraction loses Accuracy aspects on many pieces and produces
    # auto-generated names that fail Mids legacy-format imports.
    shared_overridden = 0
    for set_id in list(out_sets.keys()):
        hc_entry = hc_sets.get(set_id)
        if hc_entry:
            # Preserve our icon override if one exists.
            preserved_icon = ICON_OVERRIDES.get(set_id)
            out_sets[set_id] = dict(hc_entry)
            if preserved_icon:
                out_sets[set_id]['icon'] = preserved_icon
            shared_overridden += 1

    # Apply curated piece-data overrides for Rebirth-only sets where the
    # binary extraction is incomplete (Guardian ATOs lose Accuracy aspect).
    pieces_overridden = 0
    for set_id, pieces in PIECE_OVERRIDES.items():
        if set_id in out_sets:
            out_sets[set_id]['pieces'] = pieces
            pieces_overridden += 1

    # Apply Rebirth-specific piece renames (post HC-override so they win).
    for set_id, renames in REBIRTH_PIECE_RENAMES.items():
        entry = out_sets.get(set_id)
        if not entry:
            continue
        for p in entry.get('pieces', []):
            new_name = renames.get(p.get('num'))
            if new_name:
                p['name'] = new_name

    # Apply per-piece aspect overrides (for wiki/in-game vs binary
    # discrepancies). Each override replaces the aspect list outright and
    # regenerates the piece name from the canonical ordering.
    for set_id, piece_overrides in REBIRTH_PIECE_ASPECT_OVERRIDES.items():
        entry = out_sets.get(set_id)
        if not entry:
            continue
        for p in entry.get('pieces', []):
            new_aspects = piece_overrides.get(p.get('num'))
            if new_aspects:
                p['aspects'] = _sort_aspects_canonical(list(new_aspects))
                p['name'] = '/'.join(p['aspects'])

    print(f'\nExtracted {len(out_sets)} sets ({len(skipped)} skipped)')
    print(f'  {shared_overridden} shared sets overridden with HC data')
    print(f'  {pieces_overridden} Rebirth-only sets received curated piece data')
    print(f'  {len(out_sets) - shared_overridden} Rebirth-only sets total')
    for sk in skipped[:8]:
        print(f'  skip: {sk}')

    if _UNMAPPED_BONUS_PAIRS:
        print(f'\n!! Dropped {sum(_UNMAPPED_BONUS_PAIRS.values())} bonus tiers due to unmapped (attrib, aspect) pairs:')
        for (attrib, aspect), n in sorted(_UNMAPPED_BONUS_PAIRS.items(), key=lambda kv: -kv[1]):
            print(f'   ({attrib!r}, {aspect!r}) x {n}  -> add to ATTRIB_TO_BONUS_STAT')

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
