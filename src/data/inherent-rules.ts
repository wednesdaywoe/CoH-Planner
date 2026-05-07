/**
 * Inherent power rules facade.
 *
 * Each dataset describes the per-server quirks of the universal
 * inherent powers (Fitness L1 vs L2, Rebirth's auto-granted Health /
 * Stamina slots, future server variations). This file forwards reads
 * to the active dataset so call sites don't have to thread it through.
 */

import { getActiveDataset } from './dataset';

/**
 * Returns the `available` override for a given inherent power
 * `internalName` on the active server, or `undefined` if the dataset
 * doesn't override it. The shared InherentPowerDef default applies
 * when this returns undefined.
 */
export function getInherentAvailabilityOverride(internalName: string): number | undefined {
  return getActiveDataset().inherentRules.availabilityOverrides[internalName];
}

/**
 * Returns the auto-granted slot levels for a given inherent power
 * `internalName` on the active server. These slots come outside the
 * 67-slot user budget. Empty array (the default) means the power has
 * no auto-grants — same as HC for everything.
 */
export function getInherentAutoGrantedSlotLevels(internalName: string): readonly number[] {
  return getActiveDataset().inherentRules.autoGrantedSlotLevels[internalName] ?? [];
}

/**
 * Returns the cumulative count of auto-granted slots a power should
 * have at the given character level. Replaces the Rebirth-specific
 * helper that hard-coded Health/Stamina; now handled generically per
 * dataset.
 */
export function getInherentAutoGrantedSlotCount(internalName: string, level: number): number {
  const levels = getInherentAutoGrantedSlotLevels(internalName);
  let count = 0;
  for (const lvl of levels) {
    if (level >= lvl) count++;
  }
  return count;
}
