/**
 * Slash — OVERRIDES LAYER
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
  "internalName": "Nw_Slash",
  "description": "Slash does extreme lethal damage to your foe, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "targetType": "Foe (Alive)",
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.4,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    },
    "buffDuration": 10,
    "durations": {
      "movement": 10,
      "rechargeBuff": 10
    }
  }
};
