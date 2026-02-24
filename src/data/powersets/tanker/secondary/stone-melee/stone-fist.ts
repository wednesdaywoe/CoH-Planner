/**
 * Stone Fist
 * Melee DMG(Smash), Foe Minor Disorient,
 *
 * Source: tanker_melee/stone_melee/stone_fist.json
 */

import type { Power } from '@/types';

export const StoneFist: Power = {
  "name": "Stone Fist",
  "internalName": "Stone_Fist",
  "available": 0,
  "description": "Your stone covered fists attack swiftly for moderate damage, and may Disorient your opponent.",
  "shortHelp": "Melee DMG(Smash), Foe Minor Disorient,",
  "icon": "stonemelee_stonefist.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 0.83
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
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Melee_Stun"
    }
  }
};
