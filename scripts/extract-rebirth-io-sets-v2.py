"""Extract a full IO set library from the live game's bin files — both
Homecoming and Rebirth.

Reads boostsets.bin + powers.bin directly from the .pigg archives and emits
src/data/datasets/<dataset>/io-sets-raw.ts. Supersedes the retired
convert-io-sets.js (HC, hand-data) and extract-rebirth-io-sets.cjs (Rebirth).

Pipeline:
  1. Parse boostsets.bin → set metadata + BoostLists + Bonuses + levels
  2. For each piece (Boost power), look up powers.bin → derive aspects from
     effect-template attribs (damage types collapse to "Damage", etc.) and
     recover the effective aspect count from the enhancement scale.
  3. For each bonus (Set_Bonus power), look up powers.bin → derive effects[]
     entries: planner-canonical stat key + value (scale × per-attrib multiplier)
  4. Resolve display strings via clientmessages-en.bin
  5. Apply the per-dataset override pass (Rebirth: reuse HC for shared sets;
     HC: targeted hand overrides for what the binary can't reproduce)
  6. Emit TypeScript io-sets-raw

Usage:
    py -3 scripts/extract-rebirth-io-sets-v2.py --dataset homecoming
    py -3 scripts/extract-rebirth-io-sets-v2.py --dataset rebirth   # default
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
HC_ASSETS = r'G:/Homecoming/assets/live'
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

# Patch specific fields on a Rebirth-only piece the binary can't characterize.
# Format: set_id → {piece_num: {field: value}}.
#   Inexhaustibility's single piece carries only a `Set_Mode` marker template
#   (no real attribs, no chance/ppm group), so it extracts as name="Empty",
#   proc=false. It's a special Rest enhancement; restore the curated name +
#   proc flag. (Surfacing the Set_Mode special piece properly is a separate
#   bin-parser to-do — see BIN-PARSER-LOG.md.)
REBIRTH_PIECE_PATCHES: dict[str, dict[int, dict]] = {
    'inexhaustibility': {
        1: {'name': 'Inexhaustibility', 'proc': True},
    },
}

# ---------------------------------------------------------------------
# Homecoming-only overrides (HC IS the source for shared sets, so the
# Rebirth shared-set reuse / Rebirth piece curation above do NOT apply).
# These cover the handful of cases the binary genuinely can't reproduce;
# the bonus/whole-set data is taken from HC's existing hand-curated
# io-sets-raw.ts (parsed by _load_hc_sets), which is correct for them.
# ---------------------------------------------------------------------

# Sets whose set-bonus tiers can't be fully binary-sourced — keep HC's
# hand-curated `bonuses` array verbatim:
#   - Unique global IOs encode their signature global (e.g. Steadfast +3% Def,
#     Kismet +Acc, Karma/BotZ +KB protection) as a slottable PIECE, not a
#     Set_Bonus auto-power, so the binary has no bonus to resolve for it.
#   - PvP sets carry a second, PvP-only value for each tier that boostsets.bin
#     references with an empty auto-power list (the binary can't reach it). The
#     PvE bonuses extract correctly, but we keep the hand entry so the planner
#     still shows the PvP-mode values (which the calc skips in PvE anyway).
HC_UNIQUE_GLOBAL_SETS = {
    'gift_of_the_ancients', 'shield_wall', 'karma', 'kheldians_grace',
    'superior_kheldians_grace', 'impervious_skin', 'unbreakable_guard',
    'gladiators_armor', 'rectified_reticle', 'synapses_shock',
    'steadfast_protection', 'blessing_of_the_zephyr',
}
HC_PVP_SETS = {
    'gladiators_strike', 'gladiators_javelin', 'javelin_volley',
    'fury_of_the_gladiator', 'shield_wall', 'gladiators_armor', 'panacea',
    'gladiators_net', 'experienced_marksman',
}
HC_HAND_BONUS_SETS = HC_UNIQUE_GLOBAL_SETS | HC_PVP_SETS

# Sets the binary skips entirely (rarity=ECUniversalDamage has its own
# multi-thousand-power pool and no planner rarity mapping) — copy the whole
# hand entry. These wide-pool universal-damage sets slot into nearly every
# attack power.
HC_WHOLESET_SETS = {'cupids_crush', 'overwhelming_force'}

# Per-piece aspect overrides for the handful of pieces the binary mis-extracts
# (kept matching HC's curated names). Each replaces the parsed aspect list and
# regenerates the piece name from the canonical ordering.
#   - hypersonic #4: a "+Fly Magnitude" special aspect alongside Fly the binary
#     template doesn't surface.
#   - blessing_of_the_zephyr / winters_gift: the all-three-movement-speeds
#     collapse mislabels these travel BUFF pieces as a Slow debuff (plus a
#     spurious Range); the curated single "Move Speed" aspect is correct.
#   - sudden_acceleration #6: the KB→Knockdown converter is a single negative-
#     scale Knockback template (correctly excluded as a non-enhancement), but
#     the curated data names the special "KnockToKnockDown" aspect.
HC_PIECE_ASPECT_OVERRIDES: dict[str, dict[int, list[str]]] = {
    'hypersonic': {
        4: ['Fly', '+Fly Magnitude'],
    },
    'blessing_of_the_zephyr': {
        1: ['Move Speed'],
        2: ['Endurance', 'Move Speed'],
    },
    'winters_gift': {
        1: ['Move Speed'],
        2: ['Endurance', 'Move Speed'],
    },
    'sudden_acceleration': {
        6: ['KnockToKnockDown'],
    },
}

# Curated name + proc flag for global/special proc pieces the binary can't
# characterize. These carry an always-on global (Luck of the Gambler +Recharge,
# Steadfast +Def, the +Run Speed / +Perception / +Jump Height travel globals) or
# a Grant_Power proc, encoded as a Null / Grant_Power / Current / Maximum
# template that ISN'T a plain enhancement aspect — so proc detection misses it
# when the piece also has a real enhancement aspect, and the global's identity
# (its "+X" label) isn't derivable from the template at all (a `Null` row doesn't
# say "Recharge"). The calc gates global/proc application on the piece's `proc`
# flag (findProcData resolves the effect by set name), so without the flag the
# global is silently dropped. Names mirror the prior curated io-sets-raw so the
# slot UI matches in-game. (Sourced from the hand data, not the regenerated file,
# so it's reproducible — the self-referential _load_hc_sets snapshot is already
# binary by the time overrides run.) Enhancement aspects + scale-derived
# totalAspects come from the binary unchanged (verified equal to the hand data).
HC_PIECE_PATCHES: dict[str, dict[int, dict]] = {
    'luck_of_the_gambler':       {6: {'name': 'Defense/+Recharge', 'proc': True}},
    'gift_of_the_ancients':      {6: {'name': 'Defense/+Run Speed', 'proc': True}},
    'steadfast_protection':      {2: {'name': 'Damage Resistance/+Def(All)', 'proc': True},
                                  3: {'name': 'Knockback Protection', 'proc': True}},
    'reactive_defenses':         {6: {'name': '+Res(All)', 'proc': True}},
    'thrust':                    {4: {'name': 'Run/+Run Speed', 'proc': True}},
    'warp':                      {4: {'name': 'Range/+Perception', 'proc': True}},
    'launch':                    {4: {'name': 'Jump/+Jump Height/+Max Jump Height', 'proc': True}},
    # Stupefy #6 is a Chance-for-Knockback proc (not a global): the binary
    # can't label a Knockback proc effect (no _PROC_EFFECT_LABEL entry), so it
    # falls back to bare "Chance". Without the real name, findProcData's set
    # fallback returns the wrong Stupefy entry (the generic "Chance for Stun"
    # sits before "Chance for Knockback" in PROC_DATABASE).
    'stupefy':                   {6: {'name': 'Chance for Knockback', 'proc': True}},
    'assassins_mark':            {6: {'name': 'Recharge/Chance for Recharge Power', 'proc': True}},
    'superior_assassins_mark':   {6: {'name': 'Recharge/Chance for Recharge Power', 'proc': True}},
    'essence_transfer':          {6: {'name': 'Recharge/Chance for +Health', 'proc': True}},
    'superior_essence_transfer': {6: {'name': 'Recharge/Chance for +Health', 'proc': True}},
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

# Defense attribs — a Defense BUFF piece carries Base_Defense plus the typed +
# positional defense scalars; a Defense DEBUFF piece carries Base_Defense alone.
# Both collapse to a single aspect, distinguished by the set's EC* category
# (verified against HC's hand-curated Aegis / Achilles' Heel / etc.).
DEFENSE_ATTRIBS = {
    'Base_Defense', 'Smashing', 'Lethal', 'Fire', 'Cold', 'Energy',
    'Negative_Energy', 'Psionic', 'Toxic', 'Melee', 'Ranged', 'Area',
}
DEFENSE_DEBUFF_CATEGORIES = {'ECDefenseDebuff', 'ECAccurateDefenseDebuff'}

# Movement-speed attribs. A Slow set debuffs ALL movement, so its pieces carry
# all three speeds → single "Slow" aspect. Travel sets buff one mode → Run /
# Fly / Jump individually (JumpHeight rides along with JumpingSpeed).
MOVEMENT_SPEED_ATTRIBS = {'RunningSpeed', 'FlyingSpeed', 'JumpingSpeed'}

# ToHit is one binary attrib; the set category decides buff vs debuff label,
# matching HC's hand data ("ToHit" for buff sets, "ToHit Debuff" for debuff).
TOHIT_DEBUFF_CATEGORIES = {'ECToHitDeBuff', 'ECAccurateToHitDebuff'}

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
    'Terrorized':         'Terrorize',
    'Immobilized':        'Immobilize',
    'HitPoints':          'Heal',
    # In CoH every Heal-boosting enhancement also boosts Absorb, and the binary
    # encodes Absorb as its OWN Strength attrib on healing pieces (verified:
    # Panacea/Numina/etc. each carry HitPoints AND a distinct Absorb attrib).
    # The planner treats Heal and Absorb as separate value-diluting aspects, so
    # map the real attrib through rather than dropping it — otherwise a healing
    # piece looks like 1 aspect (Heal) and over-values, and a regen would strip
    # the Absorb the hand-data carries.
    'Absorb':             'Absorb',
    'Endurance':          'EndMod',
    'DamageType':         'Damage',
    # Travel-speed buffs (single mode). All three speeds present = a Slow set
    # instead ('Slow'), handled in _collapse_aspects.
    'RunningSpeed':       'Run',
    'FlyingSpeed':        'Fly',
    'JumpingSpeed':       'Jump',
    'JumpHeight':         'Jump',
    # Taunt/placate enhancement → Threat (Mocking Beratement, Perfect Zinger…).
    'Taunt':              'Threat',
    'Placate':            'Threat',
    'Unknown(91)':        'InterruptTime',
    # 'ToHit' is intentionally absent — mapped contextually in
    # _collapse_aspects (buff vs debuff by set category).
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

    # Defense buff/debuff — Base_Defense marks a defense piece (buffs also carry
    # the typed + positional scalars). One aspect, labelled by set category.
    if 'Base_Defense' in distinct:
        aspects.append('Defense Debuff' if set_category in DEFENSE_DEBUFF_CATEGORIES else 'Defense')
        distinct -= DEFENSE_ATTRIBS

    # Slow — a Slow set debuffs all movement, so all three speeds are present.
    # (Single-mode travel buffs fall through to Run/Fly/Jump via the map below.)
    if MOVEMENT_SPEED_ATTRIBS.issubset(distinct):
        aspects.append('Slow')
        distinct -= MOVEMENT_SPEED_ATTRIBS
        distinct.discard('JumpHeight')

    # ToHit — one binary attrib; the set category decides buff vs debuff label.
    if 'ToHit' in distinct:
        aspects.append('ToHit Debuff' if set_category in TOHIT_DEBUFF_CATEGORIES else 'ToHit')
        distinct.discard('ToHit')

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
# Full aspect ordering, derived from HC's hand-curated piece names (the order
# players see in Mids exports). Recharge is always last; Accuracy first; the
# "type" aspects (Damage/Resistance/Defense) and EndMod precede Endurance;
# Heal/Absorb sit just after Endurance; mez/movement/utility aspects follow,
# before Recharge. Any aspect NOT listed falls to the end alphabetically, so
# this list must stay comprehensive.
_ASPECT_CANONICAL_ORDER = [
    'Accuracy', 'Damage', 'Damage Resistance', 'Defense', 'Defense Debuff',
    'EndMod', 'Endurance', 'Heal', 'Absorb',
    'Hold', 'Mez', 'Confuse', 'Immobilize',
    'Knockback', 'KnockToKnockDown', 'Range',
    'Recharge',
    # HC's hand-naming places these AFTER Recharge (e.g. "Recharge/Stun",
    # "Accuracy/Recharge/Sleep", "Endurance/Recharge/ToHit Debuff").
    'Stun', 'Sleep', 'Terrorize', 'Fear',
    'Run', 'Fly', 'Jump', 'Slow', 'Move Speed',
    'Threat', 'ToHit', 'ToHit Debuff', 'ToHit Buff', 'Interrupt', 'InterruptTime',
]


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


# Multi-aspect dilution modifier — mirrors getMultiAspectModifier() in
# src/utils/calculations/enhancement-values.ts: an IO that enhances N aspects
# delivers each at this fraction of the single-aspect base.
_MULTI_ASPECT_MODIFIER = {1: 1.0, 2: 0.625, 3: 0.5, 4: 0.4375}


def _derive_effective_aspect_count(enh_scales: list[float], rarity_mult: float) -> int | None:
    """Recover a piece's effective aspect count from its enhancement scale.

    The binary stores the already-diluted enhancement magnitude:
    `scale = getMultiAspectModifier(count) × set-rarity-multiplier`. So a piece
    whose Recharge enhancement reads scale 0.4375 is a 4-aspect IO (0.4375 is
    the 4-aspect modifier); Luck of the Gambler's Defense at 0.625 is a 2-aspect
    IO. Inverting this is the *authoritative* effective count — more reliable
    than counting aspect-list entries or name segments, which under-count proc/
    global pieces (the LotG +Recharge global, ATO "#6" Recharge/Chance pieces).

    `rarity_mult` is 1.25 for purple/Superior sets (matching getSetRarityMultiplier),
    else 1.0. Returns the count, or None when no enhancement scale cleanly matches
    a modifier (pure-proc or odd-scale global pieces).

    Try the set's rarity multiplier first, then fall back to 1.0: a few Superior
    ATO "#6" proc pieces store their incidental Recharge at the un-scaled 0.4375
    (the proc, not the enhancement, carries the rarity bonus), so dividing by
    1.25 would miss the modifier. 1.0 is only reached when 1.25 finds no match,
    so a genuine ×1.25 piece (e.g. 0.78125→2) is never misread.
    """
    mults = [rarity_mult, 1.0] if rarity_mult != 1.0 else [1.0]
    for mult in mults:
        best = None
        for sc in enh_scales:
            m = sc / mult
            for count, mod in _MULTI_ASPECT_MODIFIER.items():
                if abs(m - mod) < 0.02:
                    best = count if best is None else max(best, count)
        if best is not None:
            return best
    return None


# ---------------------------------------------------------------------
# Set_Bonus power → planner bonus effect entry
# ---------------------------------------------------------------------
# A Set_Bonus power grants a buff via effect templates of (attrib, aspect,
# scale). We turn each into the planner's {stat, value} entry, where:
#   - `stat` is the planner-canonical key the set-bonus calc understands
#     (see STAT_NAME_MAP in src/utils/calculations/set-bonuses.ts). It is
#     NOT a free-form name: a key the planner doesn't recognise is silently
#     dropped from the build's totals, so these MUST match.
#   - `value` is the displayed percentage, = scale × a per-attrib multiplier
#     (see _bonus_multiplier). The binary stores `scale`; the game multiplies
#     it by an attrib-specific modifier to get the % shown in Mids.
#
# Two conventions matter for matching the planner's expectations exactly:
#   1. Paired damage types (S/L, F/C, E/N, P/T) — the planner auto-applies a
#      bonus to BOTH members of a pair (PAIRED_STATS). So a "+6% Fire/Cold"
#      bonus must emit ONLY ONE member (the alphabetically-first, e.g. cold),
#      or the value double-counts. Same for typed defence (S/L, F/C, E/N).
#   2. "All resistance"/"all mez resistance" collapse to a single
#      damage_resistance_(all) / mez_resistance_(all) key.
# Both are handled in _resolve_bonus_effects below.

# Damage-type Strength attribs that collapse to one "damage" bonus (the
# binary encodes "+X% Damage" as 8 parallel per-type templates).
_DMG_STRENGTH = {(a, 'Strength') for a in DAMAGE_ATTRIBS}
# All-8 damage Resistance → damage_resistance_(all).
_DMG_RESIST = {(a, 'Resistance') for a in DAMAGE_ATTRIBS}
# All-6 mez Resistance → mez_resistance_(all). The planner has no per-type mez
# resistance key, so individual mez resistance is intentionally NOT mapped —
# only the all-6 collapse produces a recognised key.
_MEZ_RESIST = {(m, 'Resistance') for m in MEZ_ATTRIBS}

# (attrib, aspect) → planner-canonical bonus stat key. Keys match
# STAT_NAME_MAP in set-bonuses.ts. Paired members are emitted as their own
# key here (e.g. both Fire_Dmg and Cold_Dmg → damage_resistance_(fire/cold));
# the de-dup in _resolve_bonus_effects keeps only the alpha-first of a pair.
ATTRIB_TO_BONUS_STAT = {
    # Damage resistance, per type.
    ('Smashing_Dmg',       'Resistance'): 'damage_resistance_(smashing)',
    ('Lethal_Dmg',         'Resistance'): 'damage_resistance_(lethal)',
    ('Fire_Dmg',           'Resistance'): 'damage_resistance_(fire)',
    ('Cold_Dmg',           'Resistance'): 'damage_resistance_(cold)',
    ('Energy_Dmg',         'Resistance'): 'damage_resistance_(energy)',
    ('Negative_Energy_Dmg','Resistance'): 'damage_resistance_(negative)',
    ('Psionic_Dmg',        'Resistance'): 'damage_resistance_(psionic)',
    ('Toxic_Dmg',          'Resistance'): 'damage_resistance_(toxic)',
    # Defense by position / type (aspect=Current).
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
    ('Toxic',        'Current'): 'defense_(toxic)',
    # HP / Endurance maximums.
    ('HitPoints',    'Maximum'):  'maximum_hitpoints',
    ('Endurance',    'Maximum'):  'maximum_endurance',
    # Recovery / Regeneration. HC encodes via Strength on Endurance/HitPoints;
    # Rebirth via the dedicated Recovery/Regeneration attribs (Current). Both
    # map to the same planner stats.
    ('Endurance',    'Strength'): 'recovery',
    ('HitPoints',    'Strength'): 'regeneration',
    ('Recovery',     'Strength'): 'recovery',
    ('Regeneration', 'Strength'): 'regeneration',
    ('Recovery',     'Current'):  'recovery',
    ('Regeneration', 'Current'):  'regeneration',
    # Common offensive / utility stats.
    ('RechargeTime', 'Strength'): 'recharge',
    ('ToHit',        'Strength'): 'tohit',
    ('Accuracy',     'Strength'): 'accuracy',
    ('Range',        'Strength'): 'range',
    ('PerceptionRadius', 'Current'): 'perception',
    ('EnduranceDiscount', 'Strength'): 'endurance_discount',
    ('Heal_Dmg',     'Strength'): 'healing_strength',
    # All 8 damage types × Strength → a single "damage" bonus (the dedup in
    # _resolve_bonus_effects squashes the 8 identical entries into one).
    ('Smashing_Dmg',        'Strength'): 'damage',
    ('Lethal_Dmg',          'Strength'): 'damage',
    ('Fire_Dmg',            'Strength'): 'damage',
    ('Cold_Dmg',            'Strength'): 'damage',
    ('Energy_Dmg',          'Strength'): 'damage',
    ('Negative_Energy_Dmg', 'Strength'): 'damage',
    ('Toxic_Dmg',           'Strength'): 'damage',
    ('Psionic_Dmg',         'Strength'): 'damage',
    # Mez duration buffs — extend the duration of YOUR mez attacks on enemies.
    # Per-type (no collapse): each maps to a distinct stat.
    ('Confused',     'Strength'): 'confuse_duration',
    ('Held',         'Strength'): 'hold_duration',
    ('Stunned',      'Strength'): 'stun_duration',
    ('Immobilized',  'Strength'): 'immobilize_duration',
    ('Sleep',        'Strength'): 'sleep_duration',
    ('Terrorized',   'Strength'): 'terror_duration',
    # Movement-speed buffs collapse to a single "increased_movement" bonus
    # (encoded as up to 4 parallel templates; Current and Strength both seen).
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
    # Knockback protection (magnitude points) and knockback strength buff.
    ('Knockback',    'Current'):  'knockback_protection',
    ('Knockup',      'Current'):  'knockback_protection',
    ('Knockback',    'Strength'): 'knockback_strength',
    ('Knockup',      'Strength'): 'knockback_strength',
}

# Paired stats the planner's PAIRED_STATS auto-expands to BOTH members. When
# both members of a pair appear in one tier we keep only the alpha-first key
# (matching HC's hand-data convention) so the value isn't double-counted.
_BONUS_STAT_PAIRS = [
    ('damage_resistance_(cold)',    'damage_resistance_(fire)'),
    ('damage_resistance_(lethal)',  'damage_resistance_(smashing)'),
    ('damage_resistance_(energy)',  'damage_resistance_(negative)'),
    ('damage_resistance_(psionic)', 'damage_resistance_(toxic)'),
    ('defense_(cold)',   'defense_(fire)'),
    ('defense_(lethal)', 'defense_(smashing)'),
    ('defense_(energy)', 'defense_(negative)'),
    # The planner pairs recharge-debuff resistance with slow resistance
    # (PAIRED_STATS: debuffresistrecharge → [recharge, slow]). A bonus that
    # buffs both (e.g. Avalanche: RunningSpeed+FlyingSpeed+RechargeTime all
    # Resistance) must emit only +res(recharge_debuff) so slow isn't doubled.
    ('+res(recharge_debuff)', '+res(slow)'),
]

# Per-attrib scale→value multiplier. Empirically derived and cross-validated
# against all 225 shared HC hand-data sets (scripts: see HC-IO-SETS-BINARY-
# SOURCING.md): every shared tier reproduces the hand value within float
# rounding. The game multiplies the stored `scale` by an attrib-specific
# modifier to get the displayed %:
#   - damage buff (damage-type attribs, aspect=Strength) → ×250
#   - max HP (HitPoints/Maximum)                         → ×10
#   - max endurance (Endurance/Maximum)                  → ×1 (scale is already %)
#   - everything else (resistance, defence, recharge,
#     recovery, regen, movement, mez-res, durations, …)  → ×100
def _bonus_multiplier(attrib: str, aspect: str) -> float:
    if aspect == 'Strength' and attrib in DAMAGE_ATTRIBS:
        return 250.0
    if aspect == 'Maximum':
        if attrib == 'HitPoints':
            return 10.0
        if attrib == 'Endurance':
            return 1.0
    return 100.0


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

# Pieces where the scale-derived effective aspect count is BELOW the extracted
# aspect-list length — a signal that the binary surfaced a spurious enhancement
# aspect (e.g. travel sets where the movement-speed collapse mislabels a buff).
# Printed at end-of-run as override candidates; not silently emitted.
_ASPECT_COUNT_UNDERSHOOTS: list[str] = []


def _resolve_bonus_effects(set_bonus_power: PowerRecord) -> list[dict]:
    """Build the planner's bonus effects[] list from a Set_Bonus power's
    effect templates.

    Templates are grouped by computed value (scale × per-attrib multiplier).
    Within a value group the all-resistance / all-mez / all-damage families
    collapse to a single key, the remainder map per-attrib, and paired
    resistance/defence members are de-duped to the alpha-first key so the
    planner's PAIRED_STATS expansion doesn't double-count.
    """
    # value → set of (attrib, aspect) producing that value.
    by_value: dict[float, set[tuple[str, str]]] = {}
    for eg in set_bonus_power.effects:
        for t in eg.templates:
            aspect = t.aspect or ''
            for a in (t.attribs or []):
                value = round(abs(t.scale) * _bonus_multiplier(a, aspect), 4)
                by_value.setdefault(value, set()).add((a, aspect))

    out: list[dict] = []
    for value, pairs in by_value.items():
        attset = set(pairs)
        keys: list[str] = []

        # Family collapses (only when the full family is present at this value).
        if _DMG_STRENGTH.issubset(attset):
            keys.append('damage'); attset -= _DMG_STRENGTH
        if _DMG_RESIST.issubset(attset):
            keys.append('damage_resistance_(all)'); attset -= _DMG_RESIST
        if _MEZ_RESIST.issubset(attset):
            keys.append('mez_resistance_(all)'); attset -= _MEZ_RESIST

        # Map the remainder per-attrib.
        for a, aspect in attset:
            key = ATTRIB_TO_BONUS_STAT.get((a, aspect))
            if key is None:
                if (a, aspect) not in _BONUS_LOOKUP_IGNORE:
                    _UNMAPPED_BONUS_PAIRS[(a, aspect)] = _UNMAPPED_BONUS_PAIRS.get((a, aspect), 0) + 1
                continue
            keys.append(key)

        # Drop the alpha-later member of any present pair (planner re-pairs it).
        for keep, drop in _BONUS_STAT_PAIRS:
            if keep in keys and drop in keys:
                keys = [k for k in keys if k != drop]

        # Emit one effect per distinct key, in a stable order.
        seen: set[str] = set()
        for key in keys:
            if key in seen:
                continue
            seen.add(key)
            if key == 'knockback_protection':
                value = abs(value)
            desc = f'+{value}% {key.replace("_", " ").title()}'
            out.append({'stat': key, 'value': value, 'desc': desc})
    return out


# ---------------------------------------------------------------------
# Main extraction
# ---------------------------------------------------------------------

def build_sets(
    msgs,
    sets: list[BoostSetRecord],
    power_index: dict[str, PowerRecord],
    hc_sets: dict[str, dict],
) -> tuple[dict[str, dict], list[str]]:
    """Build the raw binary io-sets shape (one entry per boostset) from the
    parsed bins. Dataset-agnostic: the per-set extraction is identical for HC
    and Rebirth — the differences live entirely in the post-build override
    passes (_apply_rebirth_overrides / _apply_homecoming_overrides).

    `hc_sets` is HC's hand-curated io-sets-raw (parsed by _load_hc_sets); it is
    consulted only for the icon fallback here (icons aren't in the binary).
    Returns (out_sets, skipped).
    """
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
            enh_scales: list[float] = []  # scales of the enhancement (Strength, +scale) templates
            is_proc_marker = False
            has_proc_group = False
            for eg in piece_power.effects:
                # A chance-gated or PPM effect group is a proc (GAME-DATA-
                # PRINCIPLES §3) — the cross-server signal, since group `chance`
                # and `ppm` are populated for both Parse7 (HC) and Parse6
                # (Rebirth, derived from tick_chance).
                if (eg.ppm or 0) > 0 or (eg.chance is not None and eg.chance < 0.999):
                    has_proc_group = True
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
                    # Enhancement aspects are aspect=Strength with a POSITIVE,
                    # non-zero scale. Excluded (→ proc effects): aspect≠Strength
                    # (proc payload, Current/Absolute), negative-scale Strength
                    # (proc debuffs — e.g. Winter's Bite's -Recharge/-Slow; sign
                    # distinguishes buff from debuff, §3), and scale==0 Strength
                    # meta-templates (the engine's strength-definition rows, §3).
                    if t.aspect == 'Strength' and t.scale > 0.001:
                        attribs.extend(t.attribs)
                        enh_scales.append(round(t.scale, 4))
                    else:
                        proc_effect_attribs.extend(t.attribs)
            aspects, is_proc = _collapse_aspects(attribs, s.category)
            is_proc = is_proc or is_proc_marker or has_proc_group
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
            # Effective aspect count, recovered from the enhancement scale (the
            # game's authoritative dilution). Emit `totalAspects` only when it
            # exceeds the aspect-list length — i.e. the piece carries hidden
            # global/proc segments that dilute its named aspect (LotG +Recharge,
            # ATO "#6" Recharge/Chance). When it's <= len(aspects) the aspect
            # list already accounts for the dilution, so no override is needed;
            # a derived count BELOW the list length signals a spurious extracted
            # aspect (logged for review, not emitted as a misleading override).
            rarity_mult = 1.25 if (rarity == 'purple' or display.startswith('Superior')) else 1.0
            eff_count = _derive_effective_aspect_count(enh_scales, rarity_mult)
            total_aspects = None
            if eff_count is not None and eff_count > len(aspects):
                total_aspects = eff_count
            elif eff_count is not None and eff_count < len(aspects):
                _ASPECT_COUNT_UNDERSHOOTS.append(
                    f'{s.name}#{i + 1}: derived {eff_count} < {len(aspects)} aspects {aspects}')
            piece = {
                'num': i + 1,
                'name': piece_display,
                'aspects': aspects,
                'proc': is_proc,
                'unique': is_unique,
            }
            if total_aspects is not None:
                piece['totalAspects'] = total_aspects
            pieces.append(piece)

        # Build bonuses. A tier may reference MULTIPLE auto-powers (e.g. the
        # six per-mez-type duration powers behind a "+Mez Duration" ATO bonus,
        # each a separate Set_Bonus.* power at a different scale); their effects
        # are additive, so aggregate across ALL of them — not just the first —
        # de-duping identical (stat, value) entries.
        bonuses_out = []
        for bn in s.bonuses:
            tier_effects: list[dict] = []
            seen_effects: set[tuple[str, float]] = set()
            for ap in bn.auto_powers:
                ap_power = power_index.get(ap) or power_index.get(f'Set_Bonus.Set_Bonus.{ap}')
                if not ap_power:
                    continue
                for eff in _resolve_bonus_effects(ap_power):
                    key = (eff['stat'], eff['value'])
                    if key in seen_effects:
                        continue
                    seen_effects.add(key)
                    tier_effects.append(eff)
            if tier_effects:
                bonuses_out.append({
                    'pieces': bn.min_boosts,
                    'effects': tier_effects,
                })

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

    return out_sets, skipped


def _apply_rebirth_overrides(out_sets: dict[str, dict], hc_sets: dict[str, dict]) -> dict:
    """Rebirth post-build passes: reuse HC's hand entry for shared sets, then
    layer the Rebirth-only piece curation. Returns a small stats dict."""
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

    # Apply field-level patches for pieces the binary can't characterize.
    for set_id, patches in REBIRTH_PIECE_PATCHES.items():
        entry = out_sets.get(set_id)
        if not entry:
            continue
        for p in entry.get('pieces', []):
            patch = patches.get(p.get('num'))
            if patch:
                p.update(patch)

    return {'shared_overridden': shared_overridden, 'pieces_overridden': pieces_overridden}


def _apply_homecoming_overrides(out_sets: dict[str, dict], hc_sets: dict[str, dict]) -> dict:
    """Homecoming post-build passes. HC IS the source, so there's no shared-set
    reuse — only the targeted overrides for what the binary can't reproduce:
      - whole-set: cupids_crush / overwhelming_force (binary skips them).
      - bonuses-from-hand: unique-global + PvP sets (see HC_HAND_BONUS_SETS).
      - per-piece aspect: hypersonic #4 (+Fly Magnitude special).
      - global/special proc name + flag: pieces the binary can't characterize
        (LotG +Recharge, Steadfast +Def, +Run Speed/+Perception globals, …).
    All hand data is read from the existing HC io-sets-raw (hc_sets)."""
    stats = {'wholeset': 0, 'hand_bonuses': 0, 'pieces_overridden': 0, 'missing': []}

    # Whole-set: bring in sets the binary doesn't yield at all.
    for set_id in HC_WHOLESET_SETS:
        hand = hc_sets.get(set_id)
        if hand:
            out_sets[set_id] = dict(hand)
            stats['wholeset'] += 1
        else:
            stats['missing'].append(f'{set_id} (wholeset)')

    # Bonuses-from-hand: keep binary pieces/icon, swap in the hand bonuses.
    for set_id in HC_HAND_BONUS_SETS:
        entry = out_sets.get(set_id)
        hand = hc_sets.get(set_id)
        if entry and hand:
            entry['bonuses'] = hand.get('bonuses', [])
            stats['hand_bonuses'] += 1
        elif not entry:
            stats['missing'].append(f'{set_id} (hand-bonus target absent from binary)')

    # Per-piece aspect overrides.
    for set_id, piece_overrides in HC_PIECE_ASPECT_OVERRIDES.items():
        entry = out_sets.get(set_id)
        if not entry:
            stats['missing'].append(f'{set_id} (piece override target absent)')
            continue
        for p in entry.get('pieces', []):
            new_aspects = piece_overrides.get(p.get('num'))
            if new_aspects:
                p['aspects'] = _sort_aspects_canonical(list(new_aspects))
                p['name'] = '/'.join(p['aspects'])
                stats['pieces_overridden'] += 1

    # Curated name + proc flag for global/special proc pieces (HC_PIECE_PATCHES).
    for set_id, patches in HC_PIECE_PATCHES.items():
        entry = out_sets.get(set_id)
        if not entry:
            stats['missing'].append(f'{set_id} (proc patch target absent)')
            continue
        for p in entry.get('pieces', []):
            patch = patches.get(p.get('num'))
            if patch:
                p.update(patch)
                stats['proc_restored'] = stats.get('proc_restored', 0) + 1

    return stats


# Per-dataset wiring: assets dir, output path, source description for the file
# header, and which override pass to run after build_sets().
DATASET_CONFIG = {
    'rebirth': {
        'assets': REBIRTH_ASSETS,
        'output': OUTPUT_PATH,
        'pigg': 'G:/Thunderspy Gaming/Sweet Tea/rebirth/z_rebirth_bin.pigg',
        'server': 'Rebirth',
        'apply_overrides': _apply_rebirth_overrides,
        'extra_notes': (
            ' * Includes Rebirth-only sets (Guardian\'s Gift, Absolute Resolution,\n'
            ' * Halloween + Winter event sets, Liberty\'s Belt, etc.) that aren\'t in\n'
            ' * HC\'s curated io-sets-raw. Shared sets reuse HC\'s hand-curated entry.\n'
        ),
    },
    'homecoming': {
        'assets': HC_ASSETS,
        'output': HC_IO_SETS_PATH,
        'pigg': 'G:/Homecoming/assets/live/bin*.pigg',
        'server': 'Homecoming',
        'apply_overrides': _apply_homecoming_overrides,
        'extra_notes': (
            ' * Targeted hand overrides (from the prior curated io-sets-raw) cover\n'
            ' * what the binary can\'t reproduce: the cupids_crush / overwhelming_force\n'
            ' * universal-damage sets, and the unique-global + PvP set bonuses.\n'
        ),
    },
}


def _file_header(cfg: dict, total: int) -> str:
    return f'''/**
 * {cfg['server']} IO Set data — extracted from live {cfg['server']} bins.
 *
 * Auto-generated by `scripts/extract-rebirth-io-sets-v2.py --dataset {cfg['_id']}`.
 * Do not hand-edit.
 *
 * Source: {cfg['pigg']}
 *   - boostsets.bin → set metadata + piece refs + bonus refs + levels
 *   - powers.bin    → boost-piece aspects (via Boosts.X.X power records)
 *                     and bonus values (via Set_Bonus.X.X power records)
 *   - clientmessages-en.bin → display name resolution
 *
 * Total sets: {total}
{cfg['extra_notes']} *
 * Set-bonus values are scale × a per-attrib multiplier (damage ×250, max HP
 * ×10, max endurance ×1, everything else ×100) and use the planner-canonical
 * stat keys (see STAT_NAME_MAP in set-bonuses.ts). Proc-piece names are
 * heuristic and may read "Chance" until resolved via the trigger attribs.
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


def _parse_dataset_arg(argv: list[str]) -> str:
    """`--dataset <id>` / `--dataset=<id>`; defaults to rebirth (the historical
    behaviour, since the script is named extract-rebirth-io-sets)."""
    for i, a in enumerate(argv):
        if a == '--dataset' and i + 1 < len(argv):
            return argv[i + 1]
        if a.startswith('--dataset='):
            return a.split('=', 1)[1]
    return 'rebirth'


def main(dataset: str | None = None) -> int:
    dataset = dataset or _parse_dataset_arg(sys.argv[1:])
    cfg = DATASET_CONFIG.get(dataset)
    if not cfg:
        print(f'Unknown dataset {dataset!r}; choose from {sorted(DATASET_CONFIG)}')
        return 2
    cfg = {**cfg, '_id': dataset}

    print(f'[{dataset}] Loading bins from {cfg["assets"]}…')
    resolver = BinResolver(cfg['assets'])
    msgs_path = resolver.read_to_tempfile('clientmessages-en.bin')
    msgs = load_messages(msgs_path)
    print(f'  {len(msgs)} client messages loaded')

    sets = parse_boostsets(resolver.read('boostsets.bin'))
    print(f'  {len(sets)} boostsets parsed')

    print('Parsing powers.bin (large, ~30s)…')
    powers = parse_powers(resolver.read('powers.bin'))
    power_index: dict[str, PowerRecord] = {p.full_name: p for p in powers}
    print(f'  {len(powers)} power records indexed')

    # HC's hand-curated io-sets-raw — used for icon fallback (both datasets),
    # Rebirth shared-set reuse, and HC's targeted bonus/whole-set overrides.
    hc_sets = _load_hc_sets()
    print(f'  {len(hc_sets)} HC hand sets loaded')

    out_sets, skipped = build_sets(msgs, sets, power_index, hc_sets)
    stats = cfg['apply_overrides'](out_sets, hc_sets)

    print(f'\n[{dataset}] Extracted {len(out_sets)} sets ({len(skipped)} skipped)')
    for k, v in stats.items():
        if k == 'missing':
            continue
        print(f'  {k}: {v}')
    if stats.get('missing'):
        print(f'  !! override targets missing: {stats["missing"]}')
    for sk in skipped[:8]:
        print(f'  skip: {sk}')

    if _UNMAPPED_BONUS_PAIRS:
        print(f'\n!! Dropped {sum(_UNMAPPED_BONUS_PAIRS.values())} bonus entries due to unmapped (attrib, aspect) pairs:')
        for (attrib, aspect), n in sorted(_UNMAPPED_BONUS_PAIRS.items(), key=lambda kv: -kv[1]):
            print(f'   ({attrib!r}, {aspect!r}) x {n}  -> add to ATTRIB_TO_BONUS_STAT')

    if _ASPECT_COUNT_UNDERSHOOTS:
        print(f'\n!! {len(_ASPECT_COUNT_UNDERSHOOTS)} pieces: scale-derived count < extracted aspects (spurious-aspect candidates):')
        for u in _ASPECT_COUNT_UNDERSHOOTS:
            print(f'   {u}')

    header = _file_header(cfg, len(out_sets))
    body = json.dumps(out_sets, indent=2, sort_keys=True)
    cfg['output'].write_text(header + body + ';\n', encoding='utf-8')
    print(f'\nWrote {cfg["output"]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
