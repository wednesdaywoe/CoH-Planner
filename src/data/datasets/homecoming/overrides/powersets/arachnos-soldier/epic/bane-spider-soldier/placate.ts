/**
 * Placate — OVERRIDES LAYER
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
  "description": "Allows you to trick a foe to no longer attack you. A successful Placate will also Hide you. The Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit. However, if you attack a Placated Foe, he will be able to attack you back. Recharge: Long",
  "shortHelp": "Melee, Foe Placate, Self Hide",
  "effectArea": "SingleTarget",
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Taunt"
  ]
};
