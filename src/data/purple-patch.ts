/**
 * Purple Patch facade.
 *
 * The actual lookup tables (combat modifiers and base ToHit by level
 * difference) live in the active dataset (e.g.
 * `src/data/datasets/homecoming/purple-patch.ts`). This file forwards reads
 * to whichever dataset is currently active so existing imports from
 * `@/data/purple-patch` keep working without consumer changes.
 *
 * Tunable per server: HC's purple patch values are widely-shared engine
 * math, but Rebirth (or other forks) can ship different scaling tables by
 * editing only their dataset folder.
 */

import { getActiveDataset } from './dataset';

export function getBaseToHit(levelDiff: number): number {
  return getActiveDataset().purplePatch.getBaseToHit(levelDiff);
}

export function getCombatModifier(levelDiff: number): number {
  return getActiveDataset().purplePatch.getCombatModifier(levelDiff);
}
