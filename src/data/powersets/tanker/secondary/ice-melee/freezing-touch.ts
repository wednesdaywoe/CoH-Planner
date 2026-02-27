/**
 * Freezing Touch
 * Melee, DoT(Cold), Foe Hold
 *
 * Source: tanker_melee/ice_melee/freezing_touch.json
 */

import type { Power } from '@/types';

export const FreezingTouch: Power = {
  "name": "Freezing Touch",
  "internalName": "Freezing_Touch",
  "available": 23,
  "description": "This Freezing Touch will encase a single foe in a block of ice. This will deal high damage over time, as well as freezing him in his tracks, leaving him cold and helpless.",
  "shortHelp": "Melee, DoT(Cold), Foe Hold",
  "icon": "icyonslaught_freezingtouch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 16,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Hold",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 0.265,
      "table": "Melee_Damage",
      "duration": 2.6,
      "tickRate": 0.25
    },
    {
      "type": "Fire",
      "scale": 0.1193,
      "table": "Melee_Damage",
      "duration": 2.6,
      "tickRate": 0.25
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    },
    "knockup": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Melee_Ones"
    }
  }
};
