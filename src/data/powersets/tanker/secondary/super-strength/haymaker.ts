/**
 * Haymaker
 * Melee, DMG(Smash), Knockback
 *
 * Source: tanker_melee/super_strength/haymaker.json
 */

import type { Power } from '@/types';

export const Haymaker: Power = {
  "name": "Haymaker",
  "internalName": "Haymaker",
  "available": 3,
  "description": "A slow but devastating attack, the Haymaker has a great chance of knocking your opponent down.",
  "shortHelp": "Melee, DMG(Smash), Knockback",
  "icon": "superstrength_haymaker.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.5
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
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
