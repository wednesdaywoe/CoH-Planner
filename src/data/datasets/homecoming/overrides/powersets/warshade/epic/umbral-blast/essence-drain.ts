/**
 * Essence Drain — OVERRIDES LAYER
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
  "description": "You tap the primal forces of your Nictus power to create an Essence Draining conduit between a foe and yourself. This will transfer Hit Points from your enemy to you. Foes drained in this manner have their attack rate and movement speed reduced.  Damage: Light. Recharge: Slow.",
  "targetType": "Foe (Alive)",
  "effects": {
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    },
    "buffDuration": 6
  }
};
