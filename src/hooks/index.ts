/**
 * Hooks barrel export
 *
 * Import hooks from here:
 * import { useCalculatedStats, useGlobalRecharge } from '@/hooks';
 */

export {
  useCalculatedStats,
  useCharacterCalculation,
  useCharacterStats,
  useGlobalBonuses,
  useStatBreakdown,
  useGlobalRecharge,
  useDefenseStats,
  useResistanceStats,
  useHealthStats,
  useTotalSlotsUsed,
  useSlotsRemaining,
  usePowersPerLevel,
  useActiveSetBonuses,
} from './useCalculatedStats';

export type {
  CalculatedStats,
  CharacterStats,
  DashboardStatBreakdown,
  StatSource,
} from './useCalculatedStats';

export { useLongPress } from './useLongPress';
export { useSwipeToRemove } from './useSwipeToRemove';
