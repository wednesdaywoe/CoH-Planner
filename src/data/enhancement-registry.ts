/**
 * Enhancement Registry - centralized, data-driven enhancement definitions
 *
 * Provides:
 * - Stat-to-icon mapping (single source of truth)
 * - Hamidon aspect mapping
 * - IO set category-to-enhancement type mapping
 * - Category priority ordering for UI display
 * - Display configuration (rarity colors, tier colors/borders)
 * - Factory functions for creating Enhancement objects
 * - Query functions for available enhancements per power
 */

import type {
  EnhancementStatType,
  IOSetCategory,
  IOSet,
  IOSetPiece,
  IOSetEnhancement,
  GenericIOEnhancement,
  SpecialEnhancement,
  OriginEnhancement,
  SpecialEnhancementDef,
} from '@/types';
import { HAMIDON_ENHANCEMENTS, TITAN_ENHANCEMENTS, HYDRA_ENHANCEMENTS, DSYNC_ENHANCEMENTS, COMMON_IO_TYPES, ORIGIN_TIERS, getCommonIOValueAtLevel } from './enhancements';
import { resolvePath } from '@/utils/paths';

// ============================================
// STAT ICON MAP
// ============================================

/**
 * Maps EnhancementStatType to icon filenames.
 * Single source of truth for both EnhancementIcon component
 * and generic IO icon resolution.
 */
export const STAT_ICON_MAP: Record<string, string> = {
  Accuracy: 'Acc.png',
  Damage: 'Damage.png',
  Recharge: 'Recharge.png',
  EnduranceReduction: 'EndRdx.png',
  Range: 'Range.png',
  Defense: 'Defbuff.png',
  Resistance: 'DamRes.png',
  Healing: 'Heal.png',
  ToHit: 'Acc.png',
  Hold: 'Hold.png',
  Stun: 'Hold.png',
  Immobilize: 'Immob.png',
  Sleep: 'Hold.png',
  Confuse: 'Confuse.png',
  Fear: 'Fear.png',
  Knockback: 'Knockback.png',
  'Run Speed': 'Run.png',
  Jump: 'Jump.png',
  Fly: 'Fly.png',
  'ToHit Debuff': 'DefDebuff.png',
  'Defense Debuff': 'DefDebuff.png',
  EnduranceModification: 'EndMod.png',
  Interrupt: 'Interrupt.png',
  Slow: 'Slow.png',
  Intangible: 'Intan.png',
  Taunt: 'Hold.png',
  Absorb: 'Heal.png',
};

/** Get icon filename for a stat type */
export function getStatIconFilename(stat: string): string {
  return STAT_ICON_MAP[stat] || 'Damage.png';
}

/** Get the full resolved path for a generic IO icon */
export function getGenericIOIconPath(stat: EnhancementStatType): string {
  const filename = STAT_ICON_MAP[stat];
  if (!filename) return resolvePath('/img/Unknown.png');
  return resolvePath(`/img/Enhancements/Generic/${filename}`);
}

/** Get the full resolved path for an origin enhancement icon */
export function getOriginIconPath(stat: EnhancementStatType, tier: string): string {
  const statPart = stat.replace(/\s+/g, '');
  return resolvePath(`/img/Enhancements/${tier}_${statPart}.png`);
}

// ============================================
// SET CATEGORY TO ENHANCEMENT TYPE MAPPING
// ============================================

/**
 * Maps IO set categories to the single enhancement types they imply.
 * Used to supplement a power's allowedEnhancements (which may be incomplete)
 * with types inferred from its allowedSetCategories.
 */
export const SET_CATEGORY_TO_ENHANCEMENT: Record<string, EnhancementStatType[]> = {
  // Damage categories
  'Ranged Damage': ['Damage', 'Accuracy', 'Range'],
  'Melee Damage': ['Damage', 'Accuracy'],
  'Ranged AoE Damage': ['Damage', 'Accuracy', 'Range'],
  'Melee AoE Damage': ['Damage', 'Accuracy'],
  'Universal Damage Sets': ['Damage', 'Accuracy'],
  'Sniper Attacks': ['Damage', 'Accuracy', 'Range'],
  'Pet Damage': ['Damage', 'Accuracy', 'Recharge'],
  // Defense/Resistance
  'Resist Damage': ['Resistance'],
  'Defense Sets': ['Defense'],
  // Control (Mez)
  'Holds': ['Hold'],
  'Stuns': ['Stun'],
  'Immobilize': ['Immobilize'],
  'Sleep': ['Sleep'],
  'Confuse': ['Confuse'],
  'Fear': ['Fear'],
  'Knockback': ['Knockback'],
  // Support/Debuff
  'Healing': ['Healing'],
  'To Hit Buff': ['ToHit'],
  'To Hit Debuff': ['ToHit Debuff'],
  'Defense Debuff': ['Defense Debuff'],
  'Accurate Healing': ['Healing', 'Accuracy'],
  'Accurate To-Hit Debuff': ['ToHit Debuff', 'Accuracy'],
  'Accurate Defense Debuff': ['Defense Debuff', 'Accuracy'],
  'Slow Movement': ['Slow'],
  'Threat Duration': ['Taunt'],
  'Endurance Modification': ['EnduranceReduction'],
  // Movement
  'Running': ['Run Speed'],
  'Running & Sprints': ['Run Speed'],
  'Leaping': ['Jump'],
  'Leaping & Sprints': ['Jump'],
  'Flight': ['Fly'],
  'Teleport': ['Range'],
  'Universal Travel': ['Run Speed', 'Jump', 'Fly'],
  // Pet sets
  'Recharge Intensive Pets': ['Damage', 'Accuracy', 'Recharge'],
  // Archetype sets
  'Blaster Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Brute Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Controller Archetype Sets': ['Hold', 'Confuse', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Corruptor Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Defender Archetype Sets': ['Healing', 'Defense', 'Recharge', 'EnduranceReduction'],
  'Dominator Archetype Sets': ['Hold', 'Accuracy', 'Damage', 'Recharge', 'EnduranceReduction'],
  'Mastermind Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Scrapper Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Stalker Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Tanker Archetype Sets': ['Defense', 'Resistance', 'Recharge', 'EnduranceReduction'],
  'Sentinel Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Kheldian Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Soldiers of Arachnos Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
};

/** Get the enhancement stat types implied by an IO set category */
export function getEnhancementTypesForCategory(category: string): EnhancementStatType[] {
  return SET_CATEGORY_TO_ENHANCEMENT[category] || [];
}

// ============================================
// CATEGORY PRIORITY
// ============================================

/**
 * Priority ordering for IO set categories in UI display.
 * The first matching category for a power's allowedSetCategories
 * is selected as the default sidebar filter.
 */
export const CATEGORY_PRIORITY: IOSetCategory[] = [
  // Primary damage categories (most common expectation)
  'Ranged Damage',
  'Melee Damage',
  'Ranged AoE Damage',
  'Melee AoE Damage',
  'Sniper Attacks',
  'Pet Damage',
  'Recharge Intensive Pets',
  // Defense/Resistance (for defensive powers)
  'Defense Sets',
  'Resist Damage',
  // Control (for mez powers)
  'Holds',
  'Stuns',
  'Immobilize',
  'Sleep',
  'Confuse',
  'Fear',
  'Knockback',
  // Support primary categories
  'Healing',
  'To Hit Buff',
  // Debuff categories (often secondary effects)
  'To Hit Debuff',
  'Defense Debuff',
  'Accurate To-Hit Debuff',
  'Accurate Defense Debuff',
  'Slow Movement',
  // Other support
  'Endurance Modification',
  'Threat Duration',
  'Accurate Healing',
  // Travel (usually specific travel powers)
  'Running',
  'Running & Sprints',
  'Leaping',
  'Leaping & Sprints',
  'Flight',
  'Teleport',
  'Universal Travel',
  // Universal sets (lowest priority - always available)
  'Universal Damage Sets',
  // Archetype sets (usually shown separately)
  'Blaster Archetype Sets',
  'Brute Archetype Sets',
  'Controller Archetype Sets',
  'Corruptor Archetype Sets',
  'Defender Archetype Sets',
  'Dominator Archetype Sets',
  'Mastermind Archetype Sets',
  'Scrapper Archetype Sets',
  'Stalker Archetype Sets',
  'Tanker Archetype Sets',
  'Sentinel Archetype Sets',
  'Kheldian Archetype Sets',
  'Soldiers of Arachnos Archetype Sets',
];

/**
 * Sort categories by priority for sidebar display.
 * Categories earlier in CATEGORY_PRIORITY appear first.
 */
export function sortCategoriesByPriority(categories: string[]): string[] {
  return categories.sort((a, b) => {
    const aIndex = CATEGORY_PRIORITY.indexOf(a as IOSetCategory);
    const bIndex = CATEGORY_PRIORITY.indexOf(b as IOSetCategory);
    const aPriority = aIndex === -1 ? 999 : aIndex;
    const bPriority = bIndex === -1 ? 999 : bIndex;
    return aPriority - bPriority;
  });
}

// ============================================
// DISPLAY CONFIGURATION
// ============================================

/** Display config for IO set rarity categories */
export const RARITY_DISPLAY: Record<string, { color: string }> = {
  purple: { color: 'text-purple-400' },
  ato: { color: 'text-yellow-400' },
  pvp: { color: 'text-red-400' },
  event: { color: 'text-cyan-400' },
};

/** Get the Tailwind text color class for a rarity category */
export function getRarityColor(category: string): string {
  return RARITY_DISPLAY[category]?.color || 'text-gray-200';
}

/** Display config for origin enhancement tiers */
export const TIER_DISPLAY: Record<string, { textColor: string; borderColor: string }> = {
  TO: { textColor: 'text-gray-400', borderColor: 'border-gray-600 hover:border-gray-400' },
  DO: { textColor: 'text-yellow-400', borderColor: 'border-yellow-700 hover:border-yellow-400' },
  SO: { textColor: 'text-orange-400', borderColor: 'border-orange-700 hover:border-orange-400' },
};

/** Get the Tailwind text color class for an origin tier */
export function getTierTextColor(tier: string): string {
  return TIER_DISPLAY[tier]?.textColor || 'text-gray-300';
}

/** Get the Tailwind border color classes for an origin tier */
export function getTierBorderColor(tier: string): string {
  return TIER_DISPLAY[tier]?.borderColor || 'border-gray-600 hover:border-gray-400';
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/** Create an IO Set Enhancement object */
export function createIOSetEnhancement(
  set: IOSet,
  piece: IOSetPiece,
  pieceIndex: number,
  options: { attuned: boolean; level: number; boost?: number },
): IOSetEnhancement {
  const setId = set.id || set.name;
  // Procs don't get boosted
  const boost = (options.boost && options.boost > 0 && !piece.proc) ? options.boost : undefined;
  return {
    type: 'io-set',
    id: `${setId}-${pieceIndex}`,
    name: piece.name,
    icon: set.icon || 'Unknown.png',
    setId,
    setName: set.name,
    pieceNum: piece.num,
    level: options.attuned ? undefined : options.level,
    attuned: options.attuned,
    boost,
    aspects: piece.aspects as EnhancementStatType[],
    isProc: piece.proc,
    isUnique: piece.unique,
  };
}

/** Create a Generic IO Enhancement object */
export function createGenericIOEnhancement(
  stat: EnhancementStatType,
  level: number,
  boost?: number,
): GenericIOEnhancement {
  return {
    type: 'io-generic',
    id: `generic-io-${stat}-${level}`,
    name: `${stat} IO`,
    icon: getGenericIOIconPath(stat),
    level,
    boost: (boost && boost > 0) ? boost : undefined,
    stat,
    value: getCommonIOValueAtLevel(level),
  };
}

/** Icon prefix for each special enhancement category */
const SPECIAL_ICON_PREFIX: Record<SpecialEnhancement['category'], string> = {
  hamidon: 'HO',
  titan: 'TN',
  hydra: 'HY',
  'd-sync': 'DS',
};

/** Create a Special Enhancement object (Hamidon, Titan, Hydra, or D-Sync) */
export function createSpecialEnhancement(
  id: string,
  def: SpecialEnhancementDef,
  category: SpecialEnhancement['category'] = 'hamidon',
  boost?: number,
): SpecialEnhancement {
  const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
  const prefix = SPECIAL_ICON_PREFIX[category];
  // D-Sync enhancements all share a single icon
  const icon = category === 'd-sync' ? 'DSO_all.png' : `${prefix}${capitalizedId}.png`;
  // Special enhancements cap at +3 boost
  const cappedBoost = (boost && boost > 0) ? Math.min(boost, 3) : undefined;
  return {
    type: 'special',
    id: `${category}-${id}`,
    name: def.name,
    icon,
    category,
    boost: cappedBoost,
    aspects: def.aspects.map(a => ({ stat: a.stat as EnhancementStatType, value: a.value })),
  };
}

/** Create an Origin Enhancement object */
export function createOriginEnhancement(
  stat: EnhancementStatType,
  tier: 'TO' | 'DO' | 'SO',
  origin?: string,
  boost?: number,
): OriginEnhancement {
  const tierInfo = ORIGIN_TIERS.find((t) => t.short === tier);
  // Origin enhancements cap at +3 boost
  const cappedBoost = (boost && boost > 0) ? Math.min(boost, 3) : undefined;
  return {
    type: 'origin',
    id: `origin-${tier}-${stat}`,
    name: `${stat} ${tier}`,
    icon: getOriginIconPath(stat, tier),
    tier,
    origin: tier === 'SO' ? (origin as OriginEnhancement['origin']) : undefined,
    boost: cappedBoost,
    stat,
    value: tierInfo?.value ?? 0,
  };
}

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Get available generic IO types for a power.
 * Combines explicitly allowed enhancement types with types
 * inferred from the power's allowedSetCategories.
 */
export function getAvailableGenericIOs(
  power: { allowedEnhancements: string[]; allowedSetCategories?: string[] } | null,
): EnhancementStatType[] {
  if (!power) return COMMON_IO_TYPES;

  const allowed = new Set(power.allowedEnhancements);

  if (power.allowedSetCategories) {
    for (const category of power.allowedSetCategories) {
      const impliedTypes = SET_CATEGORY_TO_ENHANCEMENT[category];
      if (impliedTypes) {
        for (const type of impliedTypes) {
          allowed.add(type);
        }
      }
    }
  }

  return COMMON_IO_TYPES.filter((type) => allowed.has(type));
}

/**
 * Filter a special enhancement registry by power compatibility.
 * Returns entries where at least one aspect matches the power's allowed enhancement types.
 */
function filterSpecialEnhancements(
  registry: Record<string, SpecialEnhancementDef>,
  power: { allowedEnhancements: string[] } | null,
): [string, SpecialEnhancementDef][] {
  const entries = Object.entries(registry);
  if (!power) return entries;

  const allowed = new Set(power.allowedEnhancements);
  return entries.filter(([, def]) => {
    return def.aspects.some((a) => allowed.has(a.stat));
  });
}

/** Get available Hamidon enhancements for a power */
export function getAvailableHamidons(
  power: { allowedEnhancements: string[] } | null,
): [string, SpecialEnhancementDef][] {
  return filterSpecialEnhancements(HAMIDON_ENHANCEMENTS, power);
}

/** Get available Titan enhancements for a power */
export function getAvailableTitans(
  power: { allowedEnhancements: string[] } | null,
): [string, SpecialEnhancementDef][] {
  return filterSpecialEnhancements(TITAN_ENHANCEMENTS, power);
}

/** Get available Hydra enhancements for a power */
export function getAvailableHydras(
  power: { allowedEnhancements: string[] } | null,
): [string, SpecialEnhancementDef][] {
  return filterSpecialEnhancements(HYDRA_ENHANCEMENTS, power);
}

/** Get available D-Sync enhancements for a power */
export function getAvailableDSyncs(
  power: { allowedEnhancements: string[] } | null,
): [string, SpecialEnhancementDef][] {
  return filterSpecialEnhancements(DSYNC_ENHANCEMENTS, power);
}
