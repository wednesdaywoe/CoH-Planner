/**
 * Glacial Armor
 * Toggle: Self +DEF(Energy, Negative), Res (Cold, DeBuff DEF), +Perception
 *
 * Source: stalker_defense/ice_armor/glacial_armor.json
 */

import type { Power } from '@/types';

export const GlacialArmor: Power = {
  "name": "Glacial Armor",
  "internalName": "Glacial_Armor",
  "available": 23,
  "description": "When you activate this power you cover yourself in Glacial ice. The crystalline matrix of the armor has refracting properties that make Energy and Negative Energy attacks less likely to land, and acts as a lens to increase your Perception to see hidden foes. The bitter cold of Glacial Armor also reduces Cold damage and also you to resist Defense DeBuffs.",
  "shortHelp": "Toggle: Self +DEF(Energy, Negative), Res (Cold, DeBuff DEF), +Perception",
  "icon": "icearmor_glacialarmor.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "energy": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      }
    },
    "resistance": {
      "cold": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
