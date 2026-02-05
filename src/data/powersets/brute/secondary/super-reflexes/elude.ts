/**
 * Elude
 * Self +DEF, + SPD, +Recovery, Res(DeBuff DEF), +Special
 *
 * Source: brute_defense/super_reflexes/elude.json
 */

import type { Power } from '@/types';

export const Elude: Power = {
  "name": "Elude",
  "internalName": "Elude",
  "available": 29,
  "description": "You can improve your reflexes, making yourself so quick you can Elude almost any attack, be it ranged, melee, or area effect. Your running speed, jumping height, and Endurance Recovery are also increased. Elude also grants you high resistance to Defense DeBuffs. When Elude wears off, you are left drained of all Endurance and unable to recover Endurance for a while.Recharge: Extremely Long.",
  "shortHelp": "Self +DEF, + SPD, +Recovery, Res(DeBuff DEF), +Special",
  "icon": "superreflexes_elude.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 1000,
    "endurance": 2.6,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification",
    "Running",
    "Running & Sprints",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      }
    },
    "recoveryBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "movement": {
      "jumpHeight": {
        "scale": 2,
        "table": "Melee_Ones"
      },
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_SpeedRunning"
      }
    },
    "elusivity": {
      "all": {
        "scale": 1,
        "table": "Melee_Res_Boolean"
      }
    },
    "recoveryDebuff": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
