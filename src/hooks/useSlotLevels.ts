/**
 * useSlotLevels - Memoized hook that computes slot level assignments for the current build.
 *
 * Returns a Map keyed by `powerKey`, each value parallel to the power's slots
 * array. A `null` entry is a slot the grant schedule could not place —
 * surface it, never substitute a number for it. Recalculates whenever the
 * build changes.
 */

import { useMemo } from 'react';
import { useBuildStore } from '@/stores';
import { computeAllSlotLevels, type SlotLevel } from '@/utils/slot-levels';

export function useSlotLevels(): Map<string, SlotLevel[]> {
  const build = useBuildStore((s) => s.build);
  return useMemo(() => computeAllSlotLevels(build), [build]);
}
