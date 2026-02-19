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

// Enhancement registry (centralized mappings, factory functions, query functions)
export {
  // Stat icons
  STAT_ICON_MAP,
  getStatIconFilename,
  getGenericIOIconPath,
  getOriginIconPath,
  // Hamidon mappings
  HAMIDON_ASPECT_MAP,
  mapHamidonAspect,
  // Category mappings
  SET_CATEGORY_TO_ENHANCEMENT,
  getEnhancementTypesForCategory,
  CATEGORY_PRIORITY,
  sortCategoriesByPriority,
  // Display config
  RARITY_DISPLAY,
  getRarityColor,
  TIER_DISPLAY,
  getTierTextColor,
  getTierBorderColor,
  // Factory functions
  createIOSetEnhancement,
  createGenericIOEnhancement,
  createSpecialEnhancement,
  createOriginEnhancement,
  // Query functions
  getAvailableGenericIOs,
  getAvailableHamidons,
} from './enhancement-registry';

// IO Set data and accessors
export {
  getAllIOSets,
  getIOSet,
  getIOSetsByRarity,
  getIOSetsForCategory,
  getIOSetsForPower,
  getIOSetPiece,
  getSetBonusesAtCount,
  getAllIOSetTypes,
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

// Incarnate registry (centralized slot/tier metadata, layout config, display helpers)
export {
  // Slot config
  INCARNATE_SLOT_REGISTRY,
  getSlotConfig,
  getSlotColor,
  getSlotIconFolder,
  isSlotToggleable,
  getToggleableSlotIds,
  // Tier config
  INCARNATE_TIER_REGISTRY,
  getTierConfig,
  getTierColor,
  getTierDisplayName,
  // Tree descriptions
  TREE_DESCRIPTIONS,
  getTreeDescription,
  // Tree layout
  STANDARD_TREE_LAYOUT,
  resolveTreeRow,
  // Display helpers
  RARE_SORT_KEYWORDS,
  NAME_ABBREVIATION_RULES,
  abbreviatePowerName,
  sortRarePowers,
  // Backward-compatible derived constants
  INCARNATE_SLOT_COLORS,
  INCARNATE_TIER_COLORS,
  INCARNATE_TIER_NAMES,
} from './incarnate-registry';
export type {
  IncarnateEffectType,
  IncarnateSlotConfig,
  IncarnateTierConfig,
  TreeSlotDescriptor,
  TreeRowLayout,
  TreeLayoutConfig,
} from './incarnate-registry';

// Incarnate effects data
export {
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  getIncarnateEffects,
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

// Incarnate salvage registry
export {
  SALVAGE_REGISTRY,
  SALVAGE_RARITY_COLORS,
  getSalvageDefinition,
  getSalvageDisplayName,
  getSalvageRarity,
  getSalvageRarityColor,
  getSalvageCost,
  parseSalvageString,
} from './incarnate-salvage';
export type { SalvageDefinition } from './incarnate-salvage';

// Incarnate crafting recipes
export {
  INCARNATE_RECIPES,
  CRAFTING_CONVERSIONS,
  getTierRecipe,
  calculateCumulativeCost,
} from './incarnate-recipes';

// Incarnate crafting components
export {
  LORE_TREE_NAME_MAP,
  getComponentTreeKey,
  getTreeComponents,
  getVariantComponents,
  getCumulativeSalvage,
} from './incarnate-components';

// Support power effects (curated data for heals, buffs, debuffs)
export {
  SUPPORT_POWER_EFFECTS,
  getSupportPowerEffects,
  mergeWithSupportEffects,
} from './support-power-effects';

// Proc enhancement data
export {
  PROC_DATABASE,
  getProcDataByName,
  findProcData,
  parseDamageRange,
  parseDamageType,
  parseBuffValue,
  parseDuration,
  parseProcEffect,
  getProcEffectLabel,
  getProcEffectColor,
  isProcAlwaysOn,
  // PPM calculation functions
  getPPMAreaFactor,
  calculateProcChance,
  calculateProcsPerMinute,
  calculateProcDPS,
  calculateBuffProcRate,
  calculateAutoToggleProcChance,
  calculateAutoToggleProcsPerMinute,
  calculateProcStats,
  AUTO_POWER_PSEUDO_RECHARGE,
  TOGGLE_POWER_TICK_INTERVAL,
} from './proc-data';
export type { ProcData, ProcType, ProcEffectCategory, ParsedProcEffect, PowerProcCalcData } from './proc-data';

// Granted powers (sub-powers granted by parent powers like Adaptation)
export {
  GRANTED_POWER_GROUPS,
  hasGrantedPowers,
  getGrantedPowerGroup,
  getGrantedPowerNames,
  arePowersMutuallyExclusive,
  getParentPower,
  isGrantedSubPower,
  getSiblingPowers,
  // Auto-detection functions
  parseRequiresField,
  isAutoGrantedPower,
  buildGrantedPowerMap,
  getGrantedPowersForParent,
  hasGrantedPowersSmart,
  getGrantedPowerGroupSmart,
} from './granted-powers';
export type { GrantedPowerGroup } from './granted-powers';

// Effect registry for data-driven power effect display
export {
  EFFECT_REGISTRY,
  CATEGORY_CONFIG,
  groupEffectsByCategory,
  isByTypeObject,
  isMezEffect,
  formatMezValue,
  calculateEffectValue,
  formatEffectValue as formatRegistryEffectValue,
  getByTypeAbbreviations,
  getByTypeFirstValue,
  getRegisteredEffectKeys,
  isRegisteredEffect,
} from './effect-registry';
export type {
  EffectCategory,
  EffectFormat,
  EffectDisplayConfig,
  CategoryDisplayConfig,
  GroupedEffect,
  GroupedEffects,
} from './effect-registry';
