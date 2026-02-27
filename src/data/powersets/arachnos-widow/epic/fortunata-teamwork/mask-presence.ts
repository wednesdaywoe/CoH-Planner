/**
 * Mask Presence
 * Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)
 *
 * Source: teamwork/fortunata_teamwork/frt_mask_presence.json
 */

import type { Power } from '@/types';

export const MaskPresence: Power = {
  "name": "Mask Presence",
  "available": 19,
  "description": "Mask Presence makes you almost impossible to detect. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense.",
  "shortHelp": "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
  "icon": "fortunatateamwork_maskpresence.png",
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
        "scale": 40,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 400,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.15,
        "table": "Melee_Ones"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
