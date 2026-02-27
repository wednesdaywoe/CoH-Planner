/**
 * Enduring
 * Auto: Self +Recovery, +DEF(Psionic), Res(DeBuff DEF), Res(DMG, Special)
 *
 * Source: sentinel_defense/super_reflexes/enduring.json
 */

import type { Power } from '@/types';

export const Enduring: Power = {
  "name": "Enduring",
  "internalName": "Enduring",
  "available": 15,
  "description": "You become innately more Enduring, and are able to make your endurance last longer in battle. You also manage to avoid some psionic attacks and resist Defense DeBuffs. Your Enduring determination also grants you minor Damage Resistance to all damage except Toxic and Psionic. This Damage Resistance is only available as you lose Health but it improves as your HP declines. This power is always on, and will permanently increase your endurance recovery and Defense versus psionic attacks.",
  "shortHelp": "Auto: Self +Recovery, +DEF(Psionic), Res(DeBuff DEF), Res(DMG, Special)",
  "icon": "superreflexes_endure.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "defenseBuff": {
      "psionic": {
        "scale": 1,
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
