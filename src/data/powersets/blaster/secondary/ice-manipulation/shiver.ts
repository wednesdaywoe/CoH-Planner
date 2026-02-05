/**
 * Shiver
 * Ranged (Cone), Foe -SPD, -Recharge
 *
 * Source: blaster_support/ice_manipulation/shiver.json
 */

import type { Power } from '@/types';

export const Shiver: Power = {
  "name": "Shiver",
  "internalName": "Shiver",
  "available": 23,
  "description": "You can blast forth a wide cone of chilling air that dramatically Slows the movement and attack rate of nearby foes.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Foe -SPD, -Recharge",
  "icon": "icemanipulation_shiver.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 2.3562,
    "recharge": 12,
    "endurance": 10.4,
    "castTime": 2.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeDebuff": {
      "scale": 0.325,
      "table": "Melee_Slow"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.325,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.325,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.325,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.325,
        "table": "Melee_Slow"
      }
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Melee_SpeedRunning"
      }
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
