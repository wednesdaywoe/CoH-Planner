/**
 * Hooks barrel export
 *
 * Import hooks from here:
 * import { useCalculatedStats, useGlobalBonuses } from '@/hooks';
 */

export {
  useCalculatedStats,
  useCharacterCalculation,
  useGlobalBonuses,
  useStatBreakdown,
  useTotalSlotsUsed,
  useSlotsRemaining,
  useActiveSetBonuses,
  useBonusTracking,
  useOffendingPowerNames,
  convertToLegacyStats,
} from './useCalculatedStats';

export type {
  CalculatedStats,
  CharacterStats,
  DashboardStatBreakdown,
  StatSource,
} from './useCalculatedStats';

export { useLongPress } from './useLongPress';
export { useSwipeToRemove } from './useSwipeToRemove';
export { useSlotLevels } from './useSlotLevels';
export { useIsTouchDevice, isTouchDevice } from './useIsTouchDevice';
export { useStatusCheck } from './useStatusCheck';
export type { ActiveStatus } from './useStatusCheck';
