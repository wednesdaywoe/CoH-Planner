/**
 * Stone Skin
 * Auto: Self +Res(All but Psionics), +DEF(All but Psionics)
 *
 * Source: scrapper_defense/stone_armor/stone_skin.json
 */

import type { Power } from '@/types';

export const StoneSkin: Power = {
  "name": "Stone Skin",
  "internalName": "Stone_Skin",
  "available": 0,
  "description": "Your tough skin is naturally resistant to most types of damage. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res(All but Psionics), +DEF(All but Psionics)",
  "icon": "stonearmor_stoneskin.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Defense",
    "Resistance"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "defenseBuff": {
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
