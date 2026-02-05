/**
 * Time Crawl
 * Ranged Foe, -Speed, -Recharge, -Regen, Special
 *
 * Source: corruptor_buff/time_manipulation/time_crawl.json
 */

import type { Power } from '@/types';

export const TimeCrawl: Power = {
  "name": "Time Crawl",
  "internalName": "Time_Crawl",
  "available": 0,
  "description": "You're able to dramatically slow the time around a single enemy, reducing their movement speed and attack rate. Time is slowed to such an extreme that their wounds will take longer to heal, reducing their regeneration rate. Time Crawl applies the Delayed effect on its target. Debuff and control effects from other Time Manipulation powers are increased on targets affected by Delayed.Recharge: Slow.",
  "shortHelp": "Ranged Foe, -Speed, -Recharge, -Regen, Special",
  "icon": "timemanipulation_timecrawl.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 15,
    "endurance": 10.4,
    "castTime": 1.6
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
      "scale": 0.6,
      "table": "Ranged_Slow"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    },
    "regenDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
