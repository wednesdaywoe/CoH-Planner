/**
 * Heavy Mallet
 * Melee, High DMG(Smashing), Knockback
 *
 * Source: blaster_support/earth_manipulation/heavy_mallet.json
 */

import type { Power } from '@/types';

export const HeavyMallet: Power = {
  "name": "Heavy Mallet",
  "internalName": "Heavy_Mallet",
  "available": 0,
  "description": "Your control over the earth allows you to form a mallet of solid stone. This Stone Mallet deals high damage and can knock down weak foes.Damage: High.Recharge: Slow.",
  "shortHelp": "Melee, High DMG(Smashing), Knockback",
  "icon": "earthmanip_heavymallet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee Damage",
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
