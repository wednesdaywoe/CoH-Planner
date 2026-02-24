/**
 * Heavy Mallet
 * Melee, DMG(Smashing), Knockback
 *
 * Source: brute_melee/stone_melee/heavy_mallet.json
 */

import type { Power } from '@/types';

export const HeavyMallet: Power = {
  "name": "Heavy Mallet",
  "internalName": "Heavy_Mallet",
  "available": 1,
  "description": "A more impressive form of Stone Mallet, the Heavy Mallet deals more damage, but is slower to swing. It has a greater chance of knocking down opponents.",
  "shortHelp": "Melee, DMG(Smashing), Knockback",
  "icon": "stonemelee_heavymallet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.63
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
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
  "damage": {
    "type": "Smashing",
    "scale": 2.28,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
