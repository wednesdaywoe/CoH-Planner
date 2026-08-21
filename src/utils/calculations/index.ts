/**
 * Calculation utilities barrel export
 */

// Damage calculation
export {
  getBaseDamage,
  calculateActualDamage,
  calculatePowerDamage,
  formatDamage,
  calculateBuffDebuffPercent,
  abbreviateDamageType,
  calculateArcanaTime,
  dotTickCount,
  calculateDamageWithATTable,
  type DamageTableType,
  type DamageCalculationOptions,
  type PowerDamageResult,
  type DamageEffect,
  type PowerWithDamage,
  type BuildContext,
} from './damage';

// Enhancement values
export {
  getAspectSchedule,
  getOriginTierValue,
  getIOValueAtLevel,
  normalizeAspectName,
  readAspectDisplayValue,
  genericIOValueAtLevel,
  applyED,
  parseIOSetPieceValues,
  getBoostMultiplier,
  enhancementLevelMultiplier,
  enhancementLevelAxis,
  enhancementLevelRange,
  BASE_RECOVERY_RATE,
  BASE_REGEN_RATE,
  getMultiAspectModifier,
  getEffectiveAspectCount,
  getSetRarityMultiplier,
  calculatePowerEnhancementBonuses,
  combineWithAlphaED,
  formatEnhancementValue,
  type EnhancementSchedule,
  type ParsedBonuses,
  type SlotWithEnhancement,
  type PowerWithSlots,
  type EnhancementBonuses,
  calculateSingleEnhancementValues,
} from './enhancement-values';

// Set bonuses (Rule of 5)
export {
  normalizeStatName,
  createBonusTracking,
  trackBonus,
  getAggregatedFromTracking,
  collectAllSetBonuses,
  calculateSetBonuses,
  getStatBreakdown,
  isBonusCapped,
  getBonusCount,
  getTotalBonusCount,
  getActiveSetBonusesList,
  type BonusSource,
  type ValueTracking,
  type BonusTracking,
  type AggregatedBonuses,
  type StatBreakdownItem,
  type IOSet,
  type BuildPowers,
} from './set-bonuses';

// Set tracking (shared between buildStore and compare modal)
export { computeSetTracking } from './set-tracking';

// Character stats
export {
  createEmptyStats,
  getBaselineHealth,
  type CharacterStats,
  type BaselineHealth,
} from './stats';

// Character totals (unified calculation system)
export {
  calculateCharacterTotals,
  getBreakdownForStat,
  hasStatBonuses,
  getAlphaEnhancementBonuses,
  getAlphaEdBypassBonuses,
  type GlobalBonuses as CharacterGlobalBonuses,
  type StatSource,
  type DashboardStatBreakdown,
  type CharacterCalculationResult,
} from './character-totals';

// Effective level + incarnate exemplar suppression
export {
  INCARNATE_MIN_LEVEL,
  getEffectiveLevel,
  areIncarnatesSuppressed,
} from './effective-level';

// AT-table name/id normalization
export {
  normalizeTableName,
  normalizeArchetypeId,
} from './at-table-normalize';

// Archetype inherent calculations
export {
  calculateDefiance,
  isBlasterAttackPower,
  getDominationInfo,
  getPowerDominationSummary,
  DOMINATION_MEZ_PROTECTION,
  getScourgeInfo,
  calculateScourgeChance,
  calculateScourgeDamage,
  isCorruptorAttackPower,
  getFuryInfo,
  calculateFuryDamageBonus,
  calculateFuryDamage,
  isBruteAttackPower,
  getSupremacyInfo,
  getBodyguardInfo,
  calculateSupremacyDamage,
  calculateSupremacyToHit,
  calculateBodyguardDamage,
  isMastermindPower,
  getVigilanceInfo,
  calculateVigilanceDamageBonus,
  calculateVigilanceDamage,
  isDefenderPower,
  getOpportunityInfo,
  isSentinelPower,
  getCriticalHitInfo,
  calculateCriticalHitChance,
  calculateCriticalHitDamage,
  isScrapperAttackPower,
  getAssassinationInfo,
  calculateAssassinationCritChance,
  calculateAssassinationDamageBonus,
  calculateAssassinationDamage,
  isStalkerAttackPower,
  getGauntletInfo,
  calculateGauntletRadius,
  calculateGauntletArc,
  isTankerPower,
  getContainmentInfo,
  calculateContainmentDamageBonus,
  calculateContainmentDamage,
  isControllerPower,
  type DefianceInfo,
  type DominationInfo,
  type PowerDominationSummary,
  type DominationMezType,
  type ScourgeInfo,
  type FuryInfo,
  type SupremacyInfo,
  type BodyguardInfo,
  type VigilanceInfo,
  type OpportunityInfo,
  type CriticalHitInfo,
  type CriticalHitTarget,
  type AssassinationInfo,
  type GauntletInfo,
  type ContainmentInfo,
  type ContainmentMezType,
  OPPORTUNITY_CRIT_MULTIPLIER,
  getOpportunityCritBonus,
  calculateOpportunityCritDamage,
  isSentinelAttackPower,
} from './inherents';

// Perma tracker calculations
export {
  isPermaEligible,
  calculatePermaInfo,
  type PermaInfo,
} from './perma';

// Buff/debuff base-rate rule (single source of truth)
export {
  calculateBuffDebuffFraction,
  BASE_BUFF,
  BASE_DEBUFF,
  type BuffDebuffCategory,
} from './buff-debuff';
