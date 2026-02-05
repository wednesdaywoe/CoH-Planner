/**
 * Freezing Touch
 * Melee, High DMG(Cold), Foe Hold
 *
 * Source: blaster_support/ice_manipulation/freezing_touch.json
 */

import type { Power } from '@/types';

export const FreezingTouch: Power = {
  "name": "Freezing Touch",
  "internalName": "Freezing_Touch",
  "available": 27,
  "description": "This Freezing Touch will encase a single foe in a block of ice. This will deal minor damage as well as freezing them in their tracks, leaving them cold and helpless.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Cold), Foe Hold",
  "icon": "icemanipulation_freezingtouch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Holds",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.19,
    "table": "Melee_Damage",
    "duration": 10.1,
    "tickRate": 1
  },
  "effects": {
    "knockup": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
