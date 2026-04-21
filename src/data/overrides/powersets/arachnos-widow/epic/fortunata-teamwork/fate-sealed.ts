/**
 * Fate Sealed — OVERRIDES LAYER
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
  "maxSlots": 6,
  "allowedSetCategories": [],
  "stats": {},
  "effects": {
    "specialBuff": {
      "hold": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "stun": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "immobilize": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "sleep": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "confuse": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "fear": {
        "scale": 0.33,
        "table": "Melee_Ones"
      }
    },
    "durations": {
      "confuse": 0.75,
      "fear": 0.75,
      "hold": 0.75,
      "immobilize": 0.75,
      "sleep": 0.75,
      "stun": 0.75
    }
  }
};
