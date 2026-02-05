/**
 * Power Sink
 * PBAoE, Self +End, Foe -End
 *
 * Source: blaster_support/electricity_manipulation/power_sink.json
 */

import type { Power } from '@/types';

export const PowerSink: Power = {
  "name": "Power Sink",
  "internalName": "Power_Sink",
  "available": 23,
  "description": "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance.",
  "shortHelp": "PBAoE, Self +End, Foe -End",
  "icon": "electricitymanipulation_powersink.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 60,
    "endurance": 13,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceDrain": {
      "scale": 0.35,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 25,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.048,
      "table": "Melee_Ones"
    }
  }
};
