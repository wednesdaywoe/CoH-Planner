/**
 * Stone Fist
 * Melee DMG(Smashing), Foe Minor Disorient
 *
 * Source: scrapper_melee/stone_melee/stone_fist.json
 */

import type { Power } from '@/types';

export const StoneFist: Power = {
  "name": "Stone Fist",
  "internalName": "Stone_Fist",
  "available": 0,
  "description": "Your stone-covered fists attack swiftly for moderate damage and may Disorient your opponent.",
  "shortHelp": "Melee DMG(Smashing), Foe Minor Disorient",
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
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Melee_Damage"
  }
};
