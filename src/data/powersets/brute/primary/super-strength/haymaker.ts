/**
 * Haymaker
 * Melee, DMG(Smashing), Knockback
 *
 * Source: brute_melee/super_strength/haymaker.json
 */

import type { Power } from '@/types';

export const Haymaker: Power = {
  "name": "Haymaker",
  "internalName": "Haymaker",
  "available": 1,
  "description": "A slow but devastating attack, the Haymaker has a great chance of knocking your opponent down.",
  "shortHelp": "Melee, DMG(Smashing), Knockback",
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
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee Damage",
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
