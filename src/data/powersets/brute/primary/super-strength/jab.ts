/**
 * Jab
 * Melee, DMG(Smashing), Minor Disorient
 *
 * Source: brute_melee/super_strength/jab.json
 */

import type { Power } from '@/types';

export const Jab: Power = {
  "name": "Jab",
  "internalName": "Jab",
  "available": 0,
  "description": "A quick jab that deals minor damage, but has a chance of Disorienting the target, especially if coupled with other attacks.",
  "shortHelp": "Melee, DMG(Smashing), Minor Disorient",
  "icon": "superstrength_jab.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 2,
    "endurance": 3.536,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.68,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.306,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Stun"
    }
  }
};
