/**
 * Environmental Modification — OVERRIDES LAYER
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
    "defenseBuff": {
      "fire": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      }
    },
    "durations": {
      "defenseBuff": 0.75,
      "hold": 0.75,
      "mezResistance": 0.75,
      "knockup": 0.75,
      "knockback": 0.75,
      "immobilize": 0.75
    }
  }
};
