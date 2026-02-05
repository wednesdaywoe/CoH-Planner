/**
 * Strident Echo
 * Melee, DMG(Energy/Smash), Foe Chance for Hold
 *
 * Source: dominator_assault/sonic_assault/strident_echo.json
 */

import type { Power } from '@/types';

export const StridentEcho: Power = {
  "name": "Strident Echo",
  "internalName": "Strident_Echo",
  "available": 0,
  "description": "Strident Echo deals minor damage over time. It has a low chance of causing a migraine, leaving the target shaking in pain and helpless.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Chance for Hold",
  "icon": "sonicmanipulation_stridentecho.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Holds",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.19,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 0.4
    },
    {
      "type": "Energy",
      "scale": 0.19,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 0.4
    }
  ]
};
