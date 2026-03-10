/**
 * Power Sink
 * PBAoE, Self +End, +Regen, Foe -End
 *
 * Source: stalker_defense/electric_armor/power_sink.json
 */

import type { Power } from '@/types';

export const PowerSink: Power = {
  "name": "Power Sink",
  "internalName": "Power_Sink",
  "available": 27,
  "description": "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance and regeneration rate. If there are no foes within range, you will not gain any Endurance.",
  "shortHelp": "PBAoE, Self +End, +Regen, Foe -End",
  "icon": "electricarmor_pbaoeregendrain.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 10,
    "recharge": 60,
    "endurance": 13,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceGain": {
      "scale": 15,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.175,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.35,
      "table": "Melee_Ones"
    }
  }
};
