/**
 * Gravity Well — OVERRIDES LAYER
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
  "description": "Mastery over the forces of gravity and dark matter allows you to capture a single foe and crush them in a Gravity Well. The target is Held helpless, while he is crushed by the massive gravimetric forces. The target's attack rate and movement speed are also slowed, even if they resists the Hold effect.  Damage: Extreme. Recharge: Slow.",
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Melee_Slow"
    },
    "buffDuration": 10
  }
};
