/**
 * Combustion
 * PBAoE, Moderate DoT(Fire)
 *
 * Source: dominator_assault/fiery_assault/combustion.json
 */

import type { Power } from '@/types';

export const Combustion: Power = {
  "name": "Combustion",
  "internalName": "Combustion",
  "available": 19,
  "description": "Your mastery of fire allows you to violently raise the temperature around yourself in an attempt to spontaneously combust any nearby foes and set them ablaze, dealing damage over time.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE, Moderate DoT(Fire)",
  "icon": "fireassault_combustion.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 17,
    "endurance": 15.964,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.5,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 7.1,
      "tickRate": 1
    }
  ]
};
