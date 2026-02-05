/**
 * Burst of Speed
 * Location AoE Moderate DMG (Smash), Self Teleport
 *
 * Source: blaster_support/martial_manipulation/burst_of_speed.json
 */

import type { Power } from '@/types';

export const BurstofSpeed: Power = {
  "name": "Burst of Speed",
  "internalName": "Burst_of_Speed",
  "available": 9,
  "description": "Channeling physical Ki inwards, you move more quickly than can be seen for an instant, allowing you to move instantly to a targeted location and strike at targets within melee range. You can use this Burst of Speed up to 3 times before it needs to recharge.Recharge: Long.",
  "shortHelp": "Location AoE Moderate DMG (Smash), Self Teleport",
  "icon": "martialmanipulation_burstofspeed.png",
  "powerType": "Click",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 200,
    "recharge": 90,
    "endurance": 13.52,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "Teleport",
    "Universal Damage Sets",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "teleport": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Burst_of_Speed",
      "duration": 2
    },
    "damageBuff": {
      "scale": 0.026,
      "table": "Ranged_Ones"
    }
  }
};
