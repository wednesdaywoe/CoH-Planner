/**
 * Heavy Mallet
 * Melee, Superior DMG(Smash), Knockback
 *
 * Source: dominator_assault/earth_assault/heavy_mallet.json
 */

import type { Power } from '@/types';

export const HeavyMallet: Power = {
  "name": "Heavy Mallet",
  "internalName": "Heavy_Mallet",
  "available": 19,
  "description": "A more impressive form of Stone Mallet, the Heavy Mallet deals more damage, but is slower to swing. It has a greater chance of knocking down opponents.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, Superior DMG(Smash), Knockback",
  "icon": "earthassault_heavymallet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 1.63
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.76,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
