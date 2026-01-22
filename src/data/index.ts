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
  EPIC_ARCHETYPE_IDS,
  STANDARD_ARCHETYPE_IDS,
  isEpicArchetype,
  getEpicArchetypes,
  getStandardArchetypes,
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
  getPowerIconPath,
  resolvePowerIcon,
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
  arePoolsUnlocked,
  isPowerAvailableInPool,
  getAvailablePoolPowers,
} from './power-pools';
export type { PowerPoolRegistry, PoolCategoryInfo } from './power-pools';

// Epic/Patron Pool data and accessors
export {
  getAllEpicPools,
  getEpicPool,
  getEpicPoolIds,
  getEpicPoolsForArchetype,
  getEpicPoolByName,
  getEpicPoolPower,
  getEpicPoolPowersAvailableAtLevel,
  searchEpicPools,
  getEpicPoolCountByArchetype,
  getEpicPoolPowerIconPath,
  areEpicPoolsUnlocked,
  isEpicPowerAvailable,
  getAvailableEpicPoolPowers,
} from './epic-pools';
export type { EpicPool, EpicPoolRegistry } from './epic-pools';

// Level progression data and accessors
export {
  // Constants
  MAX_LEVEL,
  EPIC_POOL_LEVEL,
  POOL_UNLOCK_LEVEL,
  MAX_POWER_POOLS,
  MAX_SLOTS_PER_POWER,
  TOTAL_SLOTS_AT_50,
  // Power picks
  POWER_PICK_LEVELS,
  isPowerPickLevel,
  getPowerPicksAtLevel,
  // Slot grants
  SLOT_GRANTS,
  getSlotsGrantedAtLevel,
  getTotalSlotsAtLevel,
  // Enhancement availability
  ENHANCEMENT_AVAILABILITY,
  isEnhancementAvailable,
  // Pool requirements
  POOL_TIER_REQUIREMENTS,
  EARLY_TRAVEL_POWERS,
  EPIC_TIER_REQUIREMENTS,
  // Epic pools
  EPIC_POOLS,
  getEpicPools,
  canAccessEpicPools,
  // Incarnate
  INCARNATE_LEVEL,
  INCARNATE_SLOTS,
  // Level info
  getLevelInfo,
  generateProgressionTable,
  // Inherent powers
  INHERENT_FITNESS_POWERS,
  BASIC_INHERENT_POWERS,
  PRESTIGE_SPRINT_POWERS,
  getInherentPowers,
  getInherentPowerDef,
  createArchetypeInherentPower,
} from './levels';
export type { LevelInfo, InherentPowerDef } from './levels';

// Accolades data and accessors
export { ACCOLADES, getAccolades, getAccolade } from './accolades';

// Incarnate data and accessors
export {
  getAllIncarnateSlots,
  getIncarnateSlot,
  getIncarnateTrees,
  getIncarnateTree,
  getIncarnatePowersForTree,
  getIncarnatePowersByTier,
  getIncarnatePower,
  getIncarnateIconPath,
  getIncarnateSlotIconPath,
} from './incarnates';

// Incarnate effects data
export {
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  getIncarnateEffects,
  isToggleableIncarnateSlot,
  formatEffectPercent,
  formatEffectValue,
} from './incarnate-effects';
export type {
  AlphaEffects,
  DestinyEffects,
  HybridEffects,
  InterfaceEffects,
  IncarnatePowerEffects,
} from './incarnate-effects';

// Support power effects (curated data for heals, buffs, debuffs)
export {
  SUPPORT_POWER_EFFECTS,
  getSupportPowerEffects,
  mergeWithSupportEffects,
} from './support-power-effects';
