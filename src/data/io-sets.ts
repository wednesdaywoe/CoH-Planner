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
import { IO_SETS_RAW } from './io-sets-raw';

// ============================================
// IO SET CATEGORIES MAPPING
// ============================================

/**
 * Maps legacy category strings to typed IOSetRarity
 */
const CATEGORY_MAP: Record<string, IOSetRarity> = {
  'io-set': 'io-set',
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
}

interface LegacySetBonusEffect {
  stat: string;
  value: number;
  desc: string;
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
    category: (CATEGORY_MAP[legacy.category] || 'io-set') as IOSetRarity,
    type: legacy.type,
    minLevel: legacy.minLevel,
    maxLevel: legacy.maxLevel,
    bonuses: legacy.bonuses.map((b) => ({
      pieces: b.pieces,
      effects: b.effects.map((e) => ({
        stat: e.stat,
        value: e.value,
        desc: e.desc,
      })),
    })),
    pieces: legacy.pieces.map((p) => ({
      num: p.num,
      name: p.name,
      aspects: p.aspects,
      proc: p.proc,
      unique: p.unique,
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

// Transform and cache the raw data at module load time
const _ioSets: IOSetRegistry = transformRegistry(IO_SETS_RAW);

/**
 * Get all IO sets
 */
export function getAllIOSets(): IOSetRegistry {
  return _ioSets;
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get an IO set by ID
 */
export function getIOSet(id: string): IOSet | undefined {
  return _ioSets[id];
}

/**
 * Get all IO sets of a specific rarity
 */
export function getIOSetsByRarity(rarity: IOSetRarity): IOSet[] {
  return Object.values(_ioSets).filter((set) => set.category === rarity);
}

/**
 * Get all IO sets that can be slotted in a power category
 */
export function getIOSetsForCategory(category: IOSetCategory): IOSet[] {
  return Object.values(_ioSets).filter((set) => {
    const mappedCategory = IO_SET_TYPE_TO_CATEGORY[set.type];
    return mappedCategory === category;
  });
}

/**
 * Get all IO sets that match any of the allowed categories for a power
 */
export function getIOSetsForPower(allowedCategories: IOSetCategory[]): IOSet[] {
  return Object.values(_ioSets).filter((set) => {
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
 * Search IO sets by name
 */
export function searchIOSets(query: string): IOSet[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(_ioSets).filter(
    (set) =>
      set.name.toLowerCase().includes(lowerQuery) || set.type.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all unique IO set types (for filtering UI)
 */
export function getAllIOSetTypes(): string[] {
  const types = new Set<string>();
  for (const set of Object.values(_ioSets)) {
    types.add(set.type);
  }
  return Array.from(types).sort();
}

/**
 * Get IO set count by rarity
 */
export function getIOSetCountByRarity(): Record<IOSetRarity, number> {
  const counts: Record<IOSetRarity, number> = {
    'io-set': 0,
    purple: 0,
    ato: 0,
    pvp: 0,
    event: 0,
  };

  for (const set of Object.values(_ioSets)) {
    counts[set.category]++;
  }

  return counts;
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
    id: 'io-set',
    name: 'Standard',
    description: 'Standard invention sets available from invention salvage',
    color: 'text-yellow-400',
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
