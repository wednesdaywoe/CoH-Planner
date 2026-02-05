/**
 * Danger Sense
 * Toggle: Self +DEF(Ranged, AoE), +Perception, Res(DeBuff DEF)
 *
 * Source: stalker_defense/ninjitsu/danger_sense.json
 */

import type { Power } from '@/types';

export const DangerSense: Power = {
  "name": "Danger Sense",
  "internalName": "Danger_Sense",
  "available": 3,
  "description": "You become more evasive against ranged and area attacks while you have Danger Sense activated. This will increase your Defense versus ranged and Area of Effect attacks as long as it is active. Your Danger Sense also allow you to perceive stealthy foes and resist Defense DeBuffs.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Ranged, AoE), +Perception, Res(DeBuff DEF)",
  "icon": "ninjitsu_dangersense.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.182,
    "castTime": 0.83
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
    "defenseBuff": {
      "ranged": {
        "scale": 1.85,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1.85,
        "table": "Melee_Buff_Def"
      }
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
