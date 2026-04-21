/**
 * Geode — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. These are the fields where the previously-committed
 * composed file differed from the current generated extraction. Review
 * each to confirm it's a deliberate manual correction (retain) vs. the
 * converter producing the wrong value (candidate for a converter fix).
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "effects": {
    "regenBuff": {
      "scale": 7.5,
      "table": "Melee_Ones"
    },
    "durations": {
      "regenBuff": 0.2,
      "recoveryBuff": 0.2,
      "mezResistance": 0.2,
      "knockup": 0.2,
      "knockback": 0.2,
      "slow": 0.2,
      "untouchable": 0.2,
      "damageDebuff": 0.2,
      "taunt": 0.2
    },
    "recoveryBuff": {
      "scale": 3,
      "table": "Melee_Ones"
    }
  }
};
