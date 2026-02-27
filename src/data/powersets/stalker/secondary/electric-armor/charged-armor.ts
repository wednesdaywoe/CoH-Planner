/**
 * Charged Armor
 * Toggle: Self +Res(Smash, Lethal, Energy)
 *
 * Source: stalker_defense/electric_armor/charged_armor.json
 */

import type { Power } from '@/types';

export const ChargedArmor: Power = {
  "name": "Charged Armor",
  "internalName": "Charged_Armor",
  "available": 0,
  "description": "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage.",
  "shortHelp": "Toggle: Self +Res(Smash, Lethal, Energy)",
  "icon": "electricarmor_selfbuffdefensephysical.png",
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
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
