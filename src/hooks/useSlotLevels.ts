/**
 * useSlotLevels - Memoized hook that computes slot level assignments for the current build.
 *
 * Returns a Map<powerName, number[]> where each number[] is parallel to the
 * power's slots array. Recalculates whenever the build changes.
 */

import { useMemo } from 'react';
import { useBuildStore } from '@/stores';
import { computeAllSlotLevels } from '@/utils/slot-levels';

export function useSlotLevels(): Map<string, number[]> {
  const build = useBuildStore((s) => s.build);
  return useMemo(() => computeAllSlotLevels(build), [build]);
}
