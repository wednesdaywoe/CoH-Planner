/**
 * Lucky
 * Auto: Self +DEF(vs. AoE), Res(DeBuff DEF), Res(All DMG, Special)
 *
 * Source: brute_defense/super_reflexes/lucky.json
 */

import type { Power } from '@/types';

export const Lucky: Power = {
  "name": "Lucky",
  "internalName": "Lucky",
  "available": 23,
  "description": "Your superior reflexes make you seem incredibly Lucky. Lucky improves your Defense to Area of Effect attacks and grants you resistance to Defense DeBuffs. Lucky also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and permanently increases your chance to evade area effects and cone shaped attacks.",
  "shortHelp": "Auto: Self +DEF(vs. AoE), Res(DeBuff DEF), Res(All DMG, Special)",
  "icon": "superreflexes_lucky.png",
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
      "aoe": {
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
