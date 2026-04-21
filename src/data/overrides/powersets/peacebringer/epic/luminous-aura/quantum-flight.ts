/**
 * Quantum Flight — OVERRIDES LAYER
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
  "description": "You shift your quantum matrix and become more energy than matter. No longer bound by the laws of normal physics, you become intangible to other entities and can fly at high speeds. However, after 30 seconds the phase out effect will wear off. 30 seconds later, if this power is still active the user will become phased out once again. Quantum Flight offers greater flight speed and some stealth, but costs more endurance.  Quantum Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.  Recharge: Slow.",
  "allowedSetCategories": [],
  "stats": {},
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
    },
    "durations": {
      "movement": 0.75,
      "stealth": 0.75,
      "threatDebuff": 0.75
    }
  }
};
