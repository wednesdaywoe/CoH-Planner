/**
 * Time Stop
 * Ranged, Foe Hold, -Regen, -Heal
 *
 * Source: blaster_support/time_manipulation/time_stop.json
 */

import type { Power } from '@/types';

export const TimeStop: Power = {
  "name": "Time Stop",
  "internalName": "Time_Stop",
  "available": 3,
  "description": "You trap your target within the flow of time causing them to be held helpless. Even those resistant to the effects of Time Stop's hold will still have their regeneration rate and healing effects reduced for a brief period. Targets affected by the Delayed effect will suffer from a more powerful hold, however its benefits are brief.Recharge: Slow.",
  "shortHelp": "Ranged, Foe Hold, -Regen, -Heal",
  "icon": "timemanipulation_timestop.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 16,
    "endurance": 11.388,
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
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 2,
      "scale": 10,
      "table": "Ranged_Immobilize"
    },
    "damageDebuff": {
      "scale": 0.25,
      "table": "Ranged_Stun"
    },
    "regenDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 0.143,
      "table": "Ranged_Ones"
    }
  }
};
