/**
 * Midnight Grasp
 * Melee, Superior DMG(Negative), Foe Immobilize, -To Hit
 *
 * Source: blaster_support/darkness_manipulation/midnight_grasp.json
 */

import type { Power } from '@/types';

export const MidnightGrasp: Power = {
  "name": "Midnight Grasp",
  "internalName": "Midnight_Grasp",
  "available": 29,
  "description": "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe and continuously drain his life force.",
  "shortHelp": "Melee, Superior DMG(Negative), Foe Immobilize, -To Hit",
  "icon": "darknessmanipulation_midnightgrasp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 18,
    "endurance": 11.96,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Blaster Archetype Sets",
    "Immobilize",
    "Melee Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 2.74,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 0.75
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Melee_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    },
    "damageBuff": {
      "scale": 0.137,
      "table": "Melee_Ones"
    }
  }
};
