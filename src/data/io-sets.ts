/**
 * IO Set data and accessor functions
 * Migrated from legacy/js/data/io-sets.js
 *
 * The raw IO set data is imported from a separate file due to its size (~28k lines).
 * This module provides typed accessors and utility functions.
 */

import type {
  IOSet,
  IOSetRegistry,
  IOSetRarity,
  IOSetCategory,
  IOSetPiece,
  SetBonus,
} from '@/types';
import { IO_SETS_RAW as IO_SETS_RAW_HC } from './io-sets-raw';
import { IO_SETS_RAW as IO_SETS_RAW_REBIRTH } from './datasets/rebirth/io-sets-raw';
import { getActiveDataset } from './dataset';

// ============================================
// IO SET CATEGORIES MAPPING
// ============================================

/**
 * Maps legacy category strings to typed IOSetRarity
 */
const CATEGORY_MAP: Record<string, IOSetRarity> = {
  uncommon: 'uncommon',
  rare: 'rare',
  purple: 'purple',
  ato: 'ato',
  pvp: 'pvp',
  event: 'event',
};

/**
 * Maps IO set types to IOSetCategory for slotting validation
 * The keys match the exact "type" values from the IO sets data
 */
export const IO_SET_TYPE_TO_CATEGORY: Record<string, IOSetCategory> = {
  // Damage categories
  'Ranged Damage': 'Ranged Damage',
  'Melee Damage': 'Melee Damage',
  'Ranged AoE Damage': 'Ranged AoE Damage',
  'Melee AoE Damage': 'Melee AoE Damage',
  'Universal Damage Sets': 'Universal Damage Sets',
  'Sniper Attacks': 'Sniper Attacks',
  'Pet Damage': 'Pet Damage',
  'Recharge Intensive Pets': 'Recharge Intensive Pets',

  // Defense/Resistance
  'Defense Sets': 'Defense Sets',
  'Resist Damage': 'Resist Damage',

  // Control (Mez)
  Holds: 'Holds',
  Stuns: 'Stuns',
  Immobilize: 'Immobilize',
  Sleep: 'Sleep',
  Confuse: 'Confuse',
  Fear: 'Fear',
  Knockback: 'Knockback',

  // Support/Debuff
  Healing: 'Healing',
  'Endurance Modification': 'Endurance Modification',
  'To Hit Buff': 'To Hit Buff',
  'To Hit Debuff': 'To Hit Debuff',
  'Defense Debuff': 'Defense Debuff',
  'Slow Movement': 'Slow Movement',
  'Threat Duration': 'Threat Duration',
  'Accurate Defense Debuff': 'Accurate Defense Debuff',
  'Accurate Healing': 'Accurate Healing',
  'Accurate To-Hit Debuff': 'Accurate To-Hit Debuff',

  // Travel
  Running: 'Running',
  'Running & Sprints': 'Running & Sprints',
  Leaping: 'Leaping',
  'Leaping & Sprints': 'Leaping & Sprints',
  Flight: 'Flight',
  Teleport: 'Teleport',
  'Universal Travel': 'Universal Travel',

  // Archetype-specific
  'Blaster Archetype Sets': 'Blaster Archetype Sets',
  'Brute Archetype Sets': 'Brute Archetype Sets',
  'Controller Archetype Sets': 'Controller Archetype Sets',
  'Corruptor Archetype Sets': 'Corruptor Archetype Sets',
  'Defender Archetype Sets': 'Defender Archetype Sets',
  'Dominator Archetype Sets': 'Dominator Archetype Sets',
  'Mastermind Archetype Sets': 'Mastermind Archetype Sets',
  'Scrapper Archetype Sets': 'Scrapper Archetype Sets',
  'Stalker Archetype Sets': 'Stalker Archetype Sets',
  'Tanker Archetype Sets': 'Tanker Archetype Sets',
  'Sentinel Archetype Sets': 'Sentinel Archetype Sets',
  'Kheldian Archetype Sets': 'Kheldian Archetype Sets',
  'Soldiers of Arachnos Archetype Sets': 'Soldiers of Arachnos Archetype Sets',
};

/**
 * Maps archetype IDs to their ATO (Archetype Origin) set category.
 * In CoH, ATOs can be slotted into ANY power of the matching archetype.
 */
export const ARCHETYPE_ATO_CATEGORY: Record<string, IOSetCategory> = {
  blaster: 'Blaster Archetype Sets',
  brute: 'Brute Archetype Sets',
  controller: 'Controller Archetype Sets',
  corruptor: 'Corruptor Archetype Sets',
  defender: 'Defender Archetype Sets',
  dominator: 'Dominator Archetype Sets',
  mastermind: 'Mastermind Archetype Sets',
  scrapper: 'Scrapper Archetype Sets',
  stalker: 'Stalker Archetype Sets',
  tanker: 'Tanker Archetype Sets',
  sentinel: 'Sentinel Archetype Sets',
  peacebringer: 'Kheldian Archetype Sets',
  warshade: 'Kheldian Archetype Sets',
  'arachnos-soldier': 'Soldiers of Arachnos Archetype Sets',
  'arachnos-widow': 'Soldiers of Arachnos Archetype Sets',
};

// ============================================
// RAW IO SET DATA
// ============================================

/**
 * Raw IO set data imported from legacy.
 * This is a large object (~227 sets) that's loaded at runtime.
 *
 * For now, we'll define the type and import the data.
 * In production, this could be lazy-loaded or code-split.
 */

// Type for the raw legacy data format
interface LegacyIOSetPiece {
  num: number;
  name: string;
  aspects: string[];
  proc: boolean;
  unique: boolean;
  totalAspects?: number;
}

interface LegacySetBonusEffect {
  stat: string;
  value: number;
  desc: string;
  pvp?: boolean;
}

interface LegacySetBonus {
  pieces: number;
  effects: LegacySetBonusEffect[];
}

interface LegacyIOSet {
  name: string;
  category: string;
  type: string;
  minLevel: number;
  maxLevel: number;
  bonuses: LegacySetBonus[];
  pieces: LegacyIOSetPiece[];
  icon: string;
}

type LegacyIOSetRegistry = Record<string, LegacyIOSet>;

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transform legacy IO set data to typed format
 */
function transformIOSet(id: string, legacy: LegacyIOSet): IOSet {
  return {
    id,
    name: legacy.name,
    category: (CATEGORY_MAP[legacy.category] || 'uncommon') as IOSetRarity,
    type: legacy.type,
    minLevel: legacy.minLevel,
    maxLevel: legacy.maxLevel,
    bonuses: legacy.bonuses.map((b) => ({
      pieces: b.pieces,
      effects: b.effects.map((e) => ({
        stat: e.stat,
        value: e.value,
        desc: e.desc,
        ...(e.pvp && { pvp: true }),
      })),
    })),
    pieces: legacy.pieces.map((p) => ({
      num: p.num,
      name: p.name,
      aspects: p.aspects,
      proc: p.proc,
      unique: p.unique,
      ...(p.totalAspects && { totalAspects: p.totalAspects }),
    })),
    icon: legacy.icon,
  };
}

/**
 * Transform entire registry
 */
function transformRegistry(legacy: LegacyIOSetRegistry): IOSetRegistry {
  const registry: IOSetRegistry = {};
  for (const [id, set] of Object.entries(legacy)) {
    registry[id] = transformIOSet(id, set);
  }
  return registry;
}

// ============================================
// IO SET REGISTRY
// ============================================

// Lazy-load + cache the transformed registry per dataset. Both raw data
// files are statically imported so they share the chunk graph; the
// transform runs once per dataset on first access.
const _registryCache = new Map<string, IOSetRegistry>();

function _resolveRawForDataset(datasetId: string) {
  switch (datasetId) {
    case 'rebirth': return IO_SETS_RAW_REBIRTH;
    case 'homecoming':
    default: return IO_SETS_RAW_HC;
  }
}

function _activeRegistry(): IOSetRegistry {
  const id = getActiveDataset().id;
  let r = _registryCache.get(id);
  if (!r) {
    r = transformRegistry(_resolveRawForDataset(id));
    _registryCache.set(id, r);
  }
  return r;
}

/**
 * Get all IO sets
 */
export function getAllIOSets(): IOSetRegistry {
  return _activeRegistry();
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get an IO set by ID
 * Falls back to hyphen-stripped lookup for backward compatibility
 * (e.g., "gaussians_synchronized_fire-control" → "gaussians_synchronized_firecontrol")
 */
export function getIOSet(id: string): IOSet | undefined {
  return _activeRegistry()[id] ?? _activeRegistry()[id.replace(/-/g, '')];
}

/**
 * Get all IO sets of a specific rarity
 */
export function getIOSetsByRarity(rarity: IOSetRarity): IOSet[] {
  return Object.values(_activeRegistry()).filter((set) => set.category === rarity);
}

/**
 * Get all IO sets that can be slotted in a power category
 */
export function getIOSetsForCategory(category: IOSetCategory): IOSet[] {
  return Object.values(_activeRegistry()).filter((set) => {
    const mappedCategory = IO_SET_TYPE_TO_CATEGORY[set.type];
    return mappedCategory === category;
  });
}

/**
 * Get all IO sets that match any of the allowed categories for a power
 */
export function getIOSetsForPower(allowedCategories: IOSetCategory[] = []): IOSet[] {
  if (!allowedCategories || allowedCategories.length === 0) return [];
  return Object.values(_activeRegistry()).filter((set) => {
    const mappedCategory = IO_SET_TYPE_TO_CATEGORY[set.type];
    return mappedCategory && allowedCategories.includes(mappedCategory);
  });
}

/**
 * Get a specific piece from an IO set
 */
export function getIOSetPiece(setId: string, pieceNum: number): IOSetPiece | undefined {
  const set = getIOSet(setId);
  return set?.pieces.find((p) => p.num === pieceNum);
}

/**
 * Get bonuses for a given number of pieces from a set
 */
export function getSetBonusesAtCount(setId: string, pieceCount: number): SetBonus[] {
  const set = getIOSet(setId);
  if (!set) return [];

  return set.bonuses.filter((b) => b.pieces <= pieceCount);
}

/**
 * Get all unique IO set types (for filtering UI)
 */
export function getAllIOSetTypes(): string[] {
  const types = new Set<string>();
  for (const set of Object.values(_activeRegistry())) {
    types.add(set.type);
  }
  return Array.from(types).sort();
}

// ============================================
// IO SET RARITY DISPLAY INFO
// ============================================

export interface IOSetRarityInfo {
  id: IOSetRarity;
  name: string;
  description: string;
  color: string;
}

export const IO_SET_RARITIES: IOSetRarityInfo[] = [
  {
    id: 'uncommon',
    name: 'Uncommon',
    description: 'Uncommon invention sets available from invention salvage',
    color: 'text-yellow-400',
  },
  {
    id: 'rare',
    name: 'Rare',
    description: 'Rare invention sets with better bonuses',
    color: 'text-orange-300',
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Rare level 50 sets with powerful bonuses',
    color: 'text-purple-400',
  },
  {
    id: 'ato',
    name: 'Archetype',
    description: 'Archetype-specific sets from Super Packs',
    color: 'text-orange-400',
  },
  {
    id: 'pvp',
    name: 'PvP',
    description: 'Sets earned from PvP activities',
    color: 'text-red-400',
  },
  {
    id: 'event',
    name: 'Event',
    description: 'Sets from seasonal events (Winter, Halloween)',
    color: 'text-cyan-400',
  },
];

/**
 * Get display info for a rarity
 */
export function getIOSetRarityInfo(rarity: IOSetRarity): IOSetRarityInfo | undefined {
  return IO_SET_RARITIES.find((r) => r.id === rarity);
}
