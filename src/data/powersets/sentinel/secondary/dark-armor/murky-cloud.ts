/**
 * Murky Cloud
 * Toggle: Self +Res(Fire, Cold, Energy, Negative, End Drain)
 *
 * Source: sentinel_defense/dark_armor/murky_cloud.json
 */

import type { Power } from '@/types';

export const MurkyCloud: Power = {
  "name": "Murky Cloud",
  "internalName": "Murky_Cloud",
  "available": 3,
  "description": "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks, as well as Endurance Drain effects.",
  "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative, End Drain)",
  "icon": "darkarmor_defractingcloud.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 1.17
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
      "fire": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "enduranceGain": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    }
  }
};
