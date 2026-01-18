/**
 * Calculation utilities barrel export
 */

// Damage calculation
export {
  getBaseDamage,
  calculateActualDamage,
  calculatePowerDamage,
  formatDamage,
  calculateBuffDebuffValue,
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
  getIOValueAtLevel,
  normalizeAspectName,
  applyED,
  parseIOSetPieceValues,
  calculatePowerEnhancementBonuses,
  calculateCommonIOValue,
  formatEnhancementValue,
  type EnhancementSchedule,
  type ParsedBonuses,
  type SlotWithEnhancement,
  type PowerWithSlots,
  type EnhancementBonuses,
} from './enhancement-values';

// Power stats
export {
  calculatePowerStats,
  formatStatForTooltip,
  isStatEnhanced,
  hasGlobalBonuses,
  calculateImprovement,
  type ThreeTierStat,
  type ComplexStat,
  type DamageScale,
  type PowerEffectsForCalc,
  type PowerForCalc,
  type GlobalBonuses,
  type PowerStats,
} from './power-stats';

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
  getActiveSetBonusesList,
  type BonusSource,
  type ValueTracking,
  type BonusTracking,
  type AggregatedBonuses,
  type StatBreakdownItem,
  type IOSet,
  type BuildPowers,
} from './set-bonuses';

// Character stats
export {
  STAT_CATEGORIES,
  DEFAULT_ENABLED_STATS,
  createEmptyStats,
  getBaselineEndurance,
  getBaselineRecovery,
  getBaselineHealth,
  calculatePoolPowerBonuses,
  calculateActivePowerBonuses,
  formatStatValue,
  STAT_TO_COMBINED,
  applyStatToCharacter,
  type StatDefinition,
  type StatCategory,
  type CharacterStats,
  type BaselineHealth,
  type PowerBonuses,
  type ActivePowerBonuses,
  type FormattedStat,
} from './stats';

// Character totals (unified calculation system)
export {
  calculateCharacterTotals,
  getBreakdownForStat,
  hasStatBonuses,
  type GlobalBonuses as CharacterGlobalBonuses,
  type StatSource,
  type DashboardStatBreakdown,
  type CharacterCalculationResult,
} from './character-totals';
