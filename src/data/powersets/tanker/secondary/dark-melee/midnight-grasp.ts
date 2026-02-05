/**
 * Midnight Grasp
 * Melee, DMG(Negative), Foe Immobilize, -To Hit
 *
 * Source: tanker_melee/dark_melee/midnight_grasp.json
 */

import type { Power } from '@/types';

export const MidnightGrasp: Power = {
  "name": "Midnight Grasp",
  "internalName": "Midnight_Grasp",
  "available": 29,
  "description": "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe and continuously drain his life force.",
  "shortHelp": "Melee, DMG(Negative), Foe Immobilize, -To Hit",
  "icon": "shadowfighting_midnightgrasp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 15,
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
    "Immobilize",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.11,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 0.75
    },
    {
      "type": "Negative",
      "scale": 2.21,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.0495,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 0.75
    },
    {
      "type": "Fire",
      "scale": 0.9945,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    },
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Melee_Immobilize"
    }
  }
};
