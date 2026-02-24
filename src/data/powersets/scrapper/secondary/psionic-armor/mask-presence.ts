/**
 * Mask Presence
 * Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)
 *
 * Source: scrapper_defense/psionic_armor/mask_presence.json
 */

import type { Power } from '@/types';

export const MaskPresence: Power = {
  "name": "Mask Presence",
  "internalName": "Mask_Presence",
  "available": 3,
  "description": "Mask Presence makes you almost impossible to detect. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense. While stealthed, the strength of your next attack will be more powerful; however, you can only attempt this after spending 8 seconds without attacking.",
  "shortHelp": "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
  "icon": "psionicarmor_maskpresence.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 4,
      "table": "Melee_Buff_Dmg"
    },
    "defenseBuff": {
      "ranged": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      }
    },
    "stealth": {
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.15,
        "table": "Melee_Ones"
      }
    }
  }
};
