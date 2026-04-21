/**
 * Inexhaustible — OVERRIDES LAYER
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
    "maxHPBuff": {
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    }
  }
};
