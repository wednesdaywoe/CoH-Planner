/**
 * Quantum Flight — OVERRIDES LAYER
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
  "description": "You shift your quantum matrix and become more energy than matter. No longer bound by the laws of normal physics, you become intangible to other entities and can fly at high speeds. However, after 30 seconds the phase out effect will wear off. 30 seconds later, if this power is still active the user will become phased out once again. Quantum Flight offers greater flight speed and some stealth, but costs more endurance.  Quantum Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.  Recharge: Slow.",
  "allowedSetCategories": [],
  "effects": {
    "stealth": {
      "translucency": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 20,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 222,
        "table": "Melee_Ones"
      }
    }
  }
};
