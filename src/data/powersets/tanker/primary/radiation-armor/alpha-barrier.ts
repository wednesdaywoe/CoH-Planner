/**
 * Alpha Barrier
 * Toggle: Self +Res(Lethal, Smash, Toxic)
 *
 * Source: tanker_defense/radiation_armor/alpha_barrier.json
 */

import type { Power } from '@/types';

export const AlphaBarrier: Power = {
  "name": "Alpha Barrier",
  "internalName": "Alpha_Barrier",
  "available": 0,
  "description": "You cloak yourself in a field of protective radiation that grants you a good deal of resistance to Lethal, Smashing and Toxic damage.",
  "shortHelp": "Toggle: Self +Res(Lethal, Smash, Toxic)",
  "icon": "radiationarmor_alphabarrier.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
