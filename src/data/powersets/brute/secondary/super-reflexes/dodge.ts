/**
 * Dodge
 * Auto: Self +DEF(Melee), Res(DeBuff DEF), Res(DMG, Special)
 *
 * Source: brute_defense/super_reflexes/dodge.json
 */

import type { Power } from '@/types';

export const Dodge: Power = {
  "name": "Dodge",
  "internalName": "Dodge",
  "available": 15,
  "description": "You have the ability to innately Dodge some melee attacks and you resist Defense DeBuffs. Dodge also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and will permanently increase your Defense versus melee attacks.",
  "shortHelp": "Auto: Self +DEF(Melee), Res(DeBuff DEF), Res(DMG, Special)",
  "icon": "superreflexes_dodge.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.2,
        "table": "Melee_Res_Boolean"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "lethal": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "fire": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "cold": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "energy": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "negative": {
        "scale": 0,
        "table": "Melee_Ones"
      }
    }
  }
};
