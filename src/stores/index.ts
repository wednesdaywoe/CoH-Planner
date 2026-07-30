/**
 * Stores barrel export
 *
 * Import stores from here:
 * import { useBuildStore, useUIStore } from '@/stores';
 */

// Build store
export {
  useBuildStore,
  useBuild,
  useArchetype,
  usePrimary,
  useSecondary,
  usePools,
  useEpicPool,
  useCraftingChecklist,
} from './buildStore';
export type { PowerCategory } from './buildStore';

// UI store
export {
  useUIStore,
  useEnhancementPicker,
  useIsPickerOpen,
  useGlobalIOLevel,
  useAttunement,
  useHintsEnabled,
  useInfoPanel,
  useTooltip,
  useStatsConfig,
  useVisibleStats,
  useDominationActive,
  useScourgeActive,
  useFuryLevel,
  useSupremacyActive,
  useVigilanceTeamSize,
  useCriticalHitsActive,
  useStalkerHidden,
  useStalkerTeamSize,
  useStalkerCritActive,
  useContainmentActive,
  useSentinelCritActive,
  usePowerViewMode,
  useTargetsHit,
  useMechanicAdjuster,
  useGlobalAdjuster,
} from './uiStore';
export type { Toast, ToastAction, ComparisonCopy } from './uiStore';

// Auth store
export { useAuthStore } from './authStore';
