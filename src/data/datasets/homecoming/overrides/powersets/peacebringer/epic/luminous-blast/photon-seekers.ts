/**
 * Photon Seekers — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "You manifest 3 spheres of light from your Kheldian essence. These spheres will follow you until they detect an enemy target. The Photon Seekers will then zero in on their targets and detonate on impact. The explosion is small but devastating and may affect multiple foes if they are near the target.  Recharge: Long."
};
