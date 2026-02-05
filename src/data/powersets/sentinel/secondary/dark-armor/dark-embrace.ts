/**
 * Dark Embrace
 * Toggle: Self +Res(Smash, Lethal, Negative, Toxic)
 *
 * Source: sentinel_defense/dark_armor/dark_embrace.json
 */

import type { Power } from '@/types';

export const DarkEmbrace: Power = {
  "name": "Dark Embrace",
  "internalName": "Dark_Embrace",
  "available": 0,
  "description": "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Negative Energy and Toxic damage.",
  "shortHelp": "Toggle: Self +Res(Smash, Lethal, Negative, Toxic)",
  "icon": "darkarmor_darkembrace.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 0.67
  },
  "allowedEnhancements": [
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
      "negative": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
