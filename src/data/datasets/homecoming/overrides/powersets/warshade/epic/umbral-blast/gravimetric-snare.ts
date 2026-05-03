/**
 * Gravimetric Snare — OVERRIDES LAYER
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
  "description": "You can hurl Gravimetric fibers to Snare your foes. Gravimetric Snare can Immobilize a single target and crush them. The target's attack rate and movement speed are also slowed, even if they resist the Immobilization effect.  Damage: Light. Recharge: Fast.",
  "targetType": "Foe (Alive)",
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    },
    "buffDuration": 6,
    "durations": {
      "movement": 6,
      "rechargeBuff": 6
    }
  }
};
