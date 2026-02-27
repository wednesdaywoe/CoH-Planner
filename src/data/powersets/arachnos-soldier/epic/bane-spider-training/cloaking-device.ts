/**
 * Cloaking Device
 * Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)
 *
 * Source: training_gadgets/bane_spider_training/hide.json
 */

import type { Power } from '@/types';

export const CloakingDevice: Power = {
  "name": "Cloaking Device",
  "available": 23,
  "description": "Cloaking Device makes you almost impossible to detect. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense.",
  "shortHelp": "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
  "icon": "banespidertraining_cloakingdevice.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "targetType": "Self",
  "effects": {
    "stealth": {
      "stealthPvE": {
        "scale": 55,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 500,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.15,
        "table": "Melee_Ones"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.375,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
