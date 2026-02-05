/**
 * Siphon Speed
 * Ranged, Foe -Speed, -Recharge, Self +Speed, +Recharge
 *
 * Source: controller_buff/kinetics/siphon_speed.json
 */

import type { Power } from '@/types';

export const SiphonSpeed: Power = {
  "name": "Siphon Speed",
  "internalName": "Siphon_Speed",
  "available": 9,
  "description": "You can Siphon the speed from a targeted foe, Slowing their movement and attack rate while boosting your own.Recharge: Slow.",
  "shortHelp": "Ranged, Foe -Speed, -Recharge, Self +Speed, +Recharge",
  "icon": "kineticboost_siphonspeed.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 60,
    "endurance": 7.8,
    "castTime": 1.93
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
    "movement": {
      "runSpeed": {
        "scale": 0.85,
        "table": "Melee_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.85,
        "table": "Melee_SpeedFlying"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Melee_SpeedRunning"
      }
    }
  }
};
