/**
 * Rebirth-only auto-grant of inherent slots to Health and Stamina.
 *
 * On Rebirth, every archetype gets four "freebie" enhancement slots that
 * appear on the inherent Fitness powers automatically (no spend from the
 * 67-slot user pool). These are NOT user-allocatable — they're permanent
 * pre-assigned slots tied to the level grant table:
 *
 *   Health:  +1 slot at L8, +1 slot at L16   (max +2 inherent)
 *   Stamina: +1 slot at L12, +1 slot at L22  (max +2 inherent)
 *
 * Total: +4 inherent slots at L22+, raising the all-up slot count from
 * Homecoming's 67 to Rebirth's 71.
 *
 * Returns the cumulative inherent slot count the named power should have
 * at the given character level. Returns 0 for HC builds, for non-fitness
 * inherents, or when the active dataset is not Rebirth.
 */

import { getActiveDataset } from '@/data/dataset';

export function rebirthInherentFitnessSlots(
  internalName: string | undefined,
  level: number,
  serverId?: string,
): number {
  // Allow callers (importers) to bypass the active-dataset check by
  // passing serverId explicitly — that's authoritative for builds that
  // travel via URL/JSON regardless of which dataset is currently loaded.
  const id = serverId ?? getActiveDataset().id;
  if (id !== 'rebirth') return 0;
  const name = internalName?.toLowerCase();
  if (name === 'health') {
    if (level >= 16) return 2;
    if (level >= 8) return 1;
    return 0;
  }
  if (name === 'stamina') {
    if (level >= 22) return 2;
    if (level >= 12) return 1;
    return 0;
  }
  return 0;
}
