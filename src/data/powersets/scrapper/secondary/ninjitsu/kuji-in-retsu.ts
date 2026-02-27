/**
 * Kuji-In Retsu
 * Self +DEF, +SPD, +Recovery, Res(DeBuff DEF), +Special
 *
 * Source: scrapper_defense/ninjitsu/kuji-in_retsu.json
 */

import type { Power } from '@/types';

export const KujiInRetsu: Power = {
  "name": "Kuji-In Retsu",
  "internalName": "Kuji-In_Retsu",
  "available": 29,
  "description": "Kuji-In Retsu is the mastery of space and time. Focusing your power on Retsu enables you to control your own time to easily defeat your foes. Mastery of this power enables you to avoid almost any attack, be it ranged, melee, or area effect. Your running speed, jumping height and Endurance Recovery are also increased. Retsu also grants you high resistance to Defense DeBuffs. When Retsu wears off, you are left drained of all Endurance and unable to recover Endurance for a while.Recharge: Extremely Long.",
  "shortHelp": "Self +DEF, +SPD, +Recovery, Res(DeBuff DEF), +Special",
  "icon": "ninjitsu_kujinzen.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 1000,
    "endurance": 2.6,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Run Speed",
    "Recharge",
    "Defense"
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
