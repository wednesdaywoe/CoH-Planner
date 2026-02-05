/**
 * Eagles Claw
 * Melee, DMG(Smash), Foe Minor Disorient, +Special
 *
 * Source: scrapper_melee/martial_arts/eagles_claw.json
 */

import type { Power } from '@/types';

export const EaglesClaw: Power = {
  "name": "Eagles Claw",
  "internalName": "Eagles_Claw",
  "available": 25,
  "description": "You can perform a devastating kick that can severely Disorient most opponents. Eagle's Claw has an exceptionally good critical hit capability, better than other Martial Arts attacks, that can sometimes deal double damage.",
  "shortHelp": "Melee, DMG(Smash), Foe Minor Disorient, +Special",
  "icon": "martialarts_eaglesclaw.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.53
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.28,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.026,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 4,
      "table": "Melee_Stun"
    }
  }
};
