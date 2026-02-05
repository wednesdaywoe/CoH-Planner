/**
 * Crane Kick
 * Melee, High DMG(Smash), Knockback
 *
 * Source: scrapper_melee/martial_arts/crane_kick.json
 */

import type { Power } from '@/types';

export const CraneKick: Power = {
  "name": "Crane Kick",
  "internalName": "Crane_Kick",
  "available": 7,
  "description": "You can perform a slow, high damage kick that will likely knock your target back.",
  "shortHelp": "Melee, High DMG(Smash), Knockback",
  "icon": "martialarts_cranekick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.882,
      "table": "Melee_Damage"
    }
  ]
};
