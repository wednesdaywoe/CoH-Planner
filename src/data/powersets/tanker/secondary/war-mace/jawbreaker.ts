/**
 * Jawbreaker
 * Melee, DMG(Smash), Knockup
 *
 * Source: tanker_melee/war_mace/jawbreaker.json
 */

import type { Power } from '@/types';

export const Jawbreaker: Power = {
  "name": "Jawbreaker",
  "internalName": "Jawbreaker",
  "available": 3,
  "description": "This upward swing attempts to shatter your opponent's jaw, and has a chance to send him flying upwards into the air.",
  "shortHelp": "Melee, DMG(Smash), Knockup",
  "icon": "mace_jawbreaker.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
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
  ],
  "effects": {
    "knockup": {
      "scale": 2,
      "table": "Melee_Knockback"
    }
  }
};
