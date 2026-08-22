/**
 * Starless Step — OVERRIDES LAYER
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
  "description": "You can Teleport moderate distances extremely quickly. These quick teleports surprise foes, giving your next attack a small ToHit advantage. This power can be used up to 3 times in a row before it starts recharging. Note that Starless is unaffected by Range changes.  Notes: Starless Step is unaffected by Range changes.  Recharge: Fast."
};
