/**
 * Bo Ryaku
 * Auto: Self +Res(Knockback, Knockup, All DMG)
 *
 * Source: scrapper_defense/ninjitsu/bo_ryaku.json
 */

import type { Power } from '@/types';

export const BoRyaku: Power = {
  "name": "Bo Ryaku",
  "internalName": "Bo_Ryaku",
  "available": 23,
  "description": "Bō Ryaku is one of the 18 fundamental skills of the Togakure-ryū school of ninjutsu. Alongside more orthodox and mainstream measures, Bō Ryaku includes use of unorthodox strategies and tactics that help you minimize the amount of damage taken in combat. This power is always on and costs no endurance.",
  "shortHelp": "Auto: Self +Res(Knockback, Knockup, All DMG)",
  "icon": "ninjitsu_resistance.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "knockup": {
      "scale": 15,
      "table": "Melee_Res_Boolean"
    },
    "knockback": {
      "scale": 15,
      "table": "Melee_Res_Boolean"
    },
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
      "psionic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
