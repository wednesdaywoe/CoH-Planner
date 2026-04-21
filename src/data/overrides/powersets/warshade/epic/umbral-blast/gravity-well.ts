/**
 * Gravity Well — OVERRIDES LAYER
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
  "description": "Mastery over the forces of gravity and dark matter allows you to capture a single foe and crush them in a Gravity Well. The target is Held helpless, while he is crushed by the massive gravimetric forces. The target's attack rate and movement speed are also slowed, even if they resists the Hold effect.  Damage: Extreme. Recharge: Slow.",
  "targetType": "Foe (Alive)",
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Melee_Slow"
    },
    "buffDuration": 10,
    "durations": {
      "movement": 10,
      "rechargeBuff": 10
    }
  }
};
