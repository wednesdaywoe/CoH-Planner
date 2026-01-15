/**
 * Data layer barrel export
 *
 * Import data and accessors from here:
 * import { getArchetype, getIOSet, HAMIDON_ENHANCEMENTS } from '@/data';
 */

// Archetype data and accessors
export {
  ARCHETYPES,
  getArchetype,
  getArchetypeIds,
  getArchetypesByFaction,
} from './archetypes';

// Enhancement data (non-IO)
export {
  HAMIDON_ENHANCEMENTS,
  calculateCommonIOValue,
  getCommonIOValueAtLevel,
  COMMON_IO_TYPES,
  ORIGIN_TIERS,
  getOriginTier,
  getOriginTierValue,
  ORIGINS,
  DUAL_ORIGIN_COMBOS,
  isDualOriginValidForOrigin,
  ENHANCEMENT_CATEGORIES,
} from './enhancements';
export type { DualOriginCombo, EnhancementCategory } from './enhancements';

// IO Set data and accessors
export {
  getAllIOSets,
  getIOSet,
  getIOSetsByRarity,
  getIOSetsForCategory,
  getIOSetsForPower,
  getIOSetPiece,
  getSetBonusesAtCount,
  searchIOSets,
  getAllIOSetTypes,
  getIOSetCountByRarity,
  IO_SET_TYPE_TO_CATEGORY,
  IO_SET_RARITIES,
  getIOSetRarityInfo,
} from './io-sets';
export type { IOSetRarityInfo } from './io-sets';

// Powerset data and accessors
export {
  getAllPowersets,
  getPowerset,
  getPowersetsForArchetype,
  getPower,
  getPowersAvailableAtLevel,
  searchPowersets,
  searchPowers,
  getPowersetCountByArchetype,
} from './powersets';
export type { PowersetRegistry } from './powersets';

// Power Pool data and accessors
export {
  getAllPowerPools,
  getPowerPool,
  getPowerPoolIds,
  getPoolPower,
  getPoolPowersAvailableAtLevel,
  getPoolEntryPowers,
  arePoolPrerequisitesMet,
  searchPowerPools,
  POOL_CATEGORIES,
  getPoolsByCategory,
} from './power-pools';
export type { PowerPoolRegistry, PoolCategoryInfo } from './power-pools';
