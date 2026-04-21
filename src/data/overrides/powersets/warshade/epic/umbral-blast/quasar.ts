/**
 * Quasar — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. Each field below is a value the previously-committed
 * composed file carried that the current CoD2-raw extraction does not.
 * Keep them — the CoD2 archive we convert from is a snapshot, and these
 * overrides are where current HC values live when they've drifted from
 * that snapshot. See src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "You can explode in a tremendous blast of Negative Energy, sending nearby foes flying. The Quasar deals massive damage to all nearby foes. Affected foes will be knocked down and their attack rate and movement speed will be slowed.  Damage: Extreme. Recharge: Long.",
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "buffDuration": 20,
    "durations": {
      "movement": 20,
      "rechargeBuff": 20
    }
  }
};
