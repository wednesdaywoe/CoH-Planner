/**
 * Crane Kick
 * Melee, DMG(Smashing), Knockback
 *
 * Source: stalker_melee/martial_arts/crane_kick.json
 */

import type { Power } from '@/types';

export const CraneKick: Power = {
  "name": "Crane Kick",
  "internalName": "Crane_Kick",
  "available": 21,
  "description": "You can perform a slow, high smashing damage kick that will likely knock your target back.",
  "shortHelp": "Melee, DMG(Smashing), Knockback",
  "icon": "martialarts_cranekick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 11.856,
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.96,
    "table": "Melee_Damage"
  }
};
