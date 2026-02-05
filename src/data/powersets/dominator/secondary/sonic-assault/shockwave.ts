/**
 * Shockwave
 * Ranged (Cone), DMG(Energy/Smash), Foe Knockback
 *
 * Source: dominator_assault/sonic_assault/shockwave.json
 */

import type { Power } from '@/types';

export const Shockwave: Power = {
  "name": "Shockwave",
  "internalName": "Shockwave",
  "available": 9,
  "description": "You can call forth a tremendous Shockwave that knocks back foes and deals Smashing damage in a wide cone area.",
  "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
  "icon": "sonicmanipulation_shockwave.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 50,
    "arc": 0.5236,
    "recharge": 13,
    "endurance": 12.688,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.5,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Ranged_Knockback"
    }
  }
};
