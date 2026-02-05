/**
 * Storm Kick
 * Melee, DMG(Smash)
 *
 * Source: scrapper_melee/martial_arts/storm_kick.json
 */

import type { Power } from '@/types';

export const StormKick: Power = {
  "name": "Storm Kick",
  "internalName": "Storm_Kick",
  "available": 0,
  "description": "You can unleash a roundhouse kick that pummels your foe for moderate damage. Storm Kick has a greater then average chance to score a critical hit.",
  "shortHelp": "Melee, DMG(Smash)",
  "icon": "martialarts_stormkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.594,
      "table": "Melee_Damage"
    }
  ]
};
