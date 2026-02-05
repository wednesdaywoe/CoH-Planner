/**
 * Entangling Arrow
 * Ranged, Target Immobilize, -Res(All), -Fly, Slow
 *
 * Source: mastermind_buff/trick_arrow/entangling_arrow.json
 */

import type { Power } from '@/types';

export const EntanglingArrow: Power = {
  "name": "Entangling Arrow",
  "internalName": "Entangling_Arrow",
  "available": 0,
  "description": "You entangle a targeted foe causing their reflexes to become slowed and sluggish. This grounds them and causes them to have decreased movement speed and damage resistance. Weaker foes will also be immobilized.Recharge: Fast.",
  "shortHelp": "Ranged, Target Immobilize, -Res(All), -Fly, Slow",
  "icon": "trickarrow_immobilize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 6.5,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Immobilize",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "slow": {
      "fly": {
        "scale": 10,
        "table": "Ranged_Ones"
      },
      "jumpHeight": {
        "scale": 500,
        "table": "Ranged_Ones"
      },
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    },
    "immobilize": {
      "mag": 3,
      "scale": 7,
      "table": "Ranged_Immobilize"
    }
  }
};
