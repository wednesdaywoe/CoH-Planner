/**
 * White Dwarf Antagonize — OVERRIDES LAYER
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
  "description": "This power attracts the attention of a foe and all those around him. Use this to pull villains off of an ally in trouble. An Accuracy check is required to Taunt enemy players, but is not needed against critter targets.  Recharge: Moderate.",
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf"
};
