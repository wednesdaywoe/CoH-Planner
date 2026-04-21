/**
 * Environmental Adaptation — OVERRIDES LAYER
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
