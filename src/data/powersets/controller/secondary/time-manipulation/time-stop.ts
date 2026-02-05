/**
 * Time Stop
 * Ranged Hold, Foe -Regen, -Heal
 *
 * Source: controller_buff/time_manipulation/time_stop.json
 */

import type { Power } from '@/types';

export const TimeStop: Power = {
  "name": "Time Stop",
  "internalName": "Time_Stop",
  "available": 19,
  "description": "You trap your target within the flow of time causing them to be held helpless. Even those resistant to the effects of Time Stop's hold will still have their regeneration rate and healing effects reduced for a brief period. Targets affected by Time Crawl will suffer from a more powerful hold, however its benefits are brief.Recharge: Slow.",
  "shortHelp": "Ranged Hold, Foe -Regen, -Heal",
  "icon": "timemanipulation_timestop.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 16,
    "endurance": 8.84,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "damageDebuff": {
      "scale": 0.25,
      "table": "Ranged_Stun"
    },
    "regenDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    }
  }
};
