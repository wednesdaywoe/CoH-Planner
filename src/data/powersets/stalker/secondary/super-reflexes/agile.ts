/**
 * Agile
 * Auto: Self +DEF(Ranged), Res(DeBuff DEF), Res(DMG, Special)
 *
 * Source: stalker_defense/super_reflexes/agile.json
 */

import type { Power } from '@/types';

export const Agile: Power = {
  "name": "Agile",
  "internalName": "Agile",
  "available": 9,
  "description": "You become innately more Agile, and are able to naturally avoid some ranged attacks and resist Defense DeBuffs. Your Agility also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and will permanently increase your Defense versus ranged attacks.",
  "shortHelp": "Auto: Self +DEF(Ranged), Res(DeBuff DEF), Res(DMG, Special)",
  "icon": "superreflexes_agile.png",
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
      "ranged": {
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
