/**
 * Time's Juncture
 * Toggle: PBAoE Foe (-Damage, -Speed, -To Hit)
 *
 * Source: controller_buff/time_manipulation/times_juncture.json
 */

import type { Power } from '@/types';

export const TimesJuncture: Power = {
  "name": "Time's Juncture",
  "internalName": "Times_Juncture",
  "available": 3,
  "description": "You create a time dilation field around you causing enemies who get too close to be slowed to a crawl, their movement speed, damage and chance to hit will be decreased substantially. Enemies affected by Delayed have these affects increased.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE Foe (-Damage, -Speed, -To Hit)",
  "icon": "timemanipulation_timesjuncture.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 10,
    "endurance": 0.39,
    "castTime": 0.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "Slow Movement",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.36,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.36,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.36,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.36,
        "table": "Ranged_Slow"
      }
    },
    "slow": {
      "fly": {
        "scale": 1.92,
        "table": "Ranged_Ones"
      },
      "runSpeed": {
        "scale": 1.2,
        "table": "Ranged_SpeedRunning"
      }
    },
    "damageDebuff": {
      "scale": 2.4,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
