/**
 * Conductive Shield
 * Toggle: Self +Res(Fire, Cold, Energy, Negative)
 *
 * Source: tanker_defense/electric_armor/conductive_shield.json
 */

import type { Power } from '@/types';

export const ConductiveShield: Power = {
  "name": "Conductive Shield",
  "internalName": "Conductive_Shield",
  "available": 1,
  "description": "When you toggle on this power, you are surrounded in a Conductive Shield that will conduct many sorts of energy away from your body. Conductive Shield grants high resistant to Fire, Cold, and Energy damage, as well as good resistance to Negative Energy damage.",
  "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative)",
  "icon": "electricarmor_selfresistelements.png",
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
      "fire": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
