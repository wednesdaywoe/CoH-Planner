/**
 * Black Dwarf Step — OVERRIDES LAYER
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
  "targetType": "Location (Teleport)",
  "requires": "Black Dwarf",
  "effects": {
    "movement": {
      "fly": {
        "scale": 1,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 500,
        "table": "Melee_SpeedFlying"
      },
      "movementControl": {
        "scale": 8,
        "table": "Melee_Ones"
      },
      "movementFriction": {
        "scale": 8,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 1.5,
    "durations": {
      "movement": 1.5,
      "stealth": 1.5
    }
  }
};
