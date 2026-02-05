/**
 * Bonfire
 * Ranged (Location AoE), Minor DMG(Fire), Foe Knockback
 *
 * Source: dominator_control/fire_control/bonfire.json
 */

import type { Power } from '@/types';

export const Bonfire: Power = {
  "name": "Bonfire",
  "internalName": "Bonfire",
  "available": 21,
  "description": "You can create a Bonfire that knocks back and burns any foes who try to pass through it.",
  "shortHelp": "Ranged (Location AoE), Minor DMG(Fire), Foe Knockback",
  "icon": "firetrap_bonfire.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 60,
    "endurance": 13,
    "castTime": 3.07
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
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Bonfire",
      "powers": [
        "Pets.Bonfire.Bonfire"
      ],
      "duration": 45
    }
  }
};
