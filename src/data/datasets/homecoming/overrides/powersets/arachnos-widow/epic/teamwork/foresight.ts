/**
 * Foresight — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "effects": {
    "specialBuff": {
      "hold": {
        "scale": 0.25,
        "table": "Melee_Ones"
      },
      "stun": {
        "scale": 0.25,
        "table": "Melee_Ones"
      },
      "immobilize": {
        "scale": 0.25,
        "table": "Melee_Ones"
      },
      "sleep": {
        "scale": 0.25,
        "table": "Melee_Ones"
      },
      "confuse": {
        "scale": 0.25,
        "table": "Melee_Ones"
      },
      "fear": {
        "scale": 0.25,
        "table": "Melee_Ones"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    },
    "effectDuration": 0.75
  }
};
