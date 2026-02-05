/**
 * Snow Storm
 * Toggle: Ranged (Targeted AoE), Foe -Speed, -Recharge, -Fly
 *
 * Source: controller_buff/storm_summoning/snow_storm.json
 */

import type { Power } from '@/types';

export const SnowStorm: Power = {
  "name": "Snow Storm",
  "internalName": "Snow_Storm",
  "available": 3,
  "description": "While active, the chill from this Snow Storm can dramatically Slow the attack and movement speed of the target and all nearby foes. The torrent winds of the Snow Storm are enough to bring down flying foes.Recharge: Moderate.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -Speed, -Recharge, -Fly",
  "icon": "stormsummoning_snowstorm.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 10,
    "endurance": 0.26,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
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
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
