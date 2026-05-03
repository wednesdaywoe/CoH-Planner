/**
 * Black Dwarf Drain — OVERRIDES LAYER
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
  "description": "You tap the primal forces of your Nictus power to create an Essence Draining conduit between a foe and yourself. This will transfer Hit Points from your enemy to yourself. Foes drained in this manner have their attack and movement speed reduced. This power is only available while in Black Dwarf Form.  Damage: Light. Recharge: Slow.",
  "targetType": "Foe (Alive)",
  "requires": "Black Dwarf",
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    },
    "buffDuration": 6,
    "durations": {
      "movement": 6,
      "rechargeBuff": 6
    }
  }
};
