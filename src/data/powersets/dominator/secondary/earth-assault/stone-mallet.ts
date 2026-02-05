/**
 * Stone Mallet
 * Melee, Moderate DMG(Smash), Knockback
 *
 * Source: dominator_assault/earth_assault/stone_mallet.json
 */

import type { Power } from '@/types';

export const StoneMallet: Power = {
  "name": "Stone Mallet",
  "internalName": "Stone_Mallet",
  "available": 0,
  "description": "Your control over the earth allows you to form a mallet of solid stone. This Stone Mallet deals heavy damage, and can knock down weak foes.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Melee, Moderate DMG(Smash), Knockback",
  "icon": "earthassault_stonemallet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.6
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
    "scale": 1.64,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
