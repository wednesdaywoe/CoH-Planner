/**
 * Tremor
 * PBAoE, Light DMG(Smash), Knockback
 *
 * Source: dominator_assault/earth_assault/tremor.json
 */

import type { Power } from '@/types';

export const Tremor: Power = {
  "name": "Tremor",
  "internalName": "Tremor",
  "available": 3,
  "description": "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range, while knocking them back.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE, Light DMG(Smash), Knockback",
  "icon": "earthassault_tremor.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 18,
    "endurance": 16.848,
    "castTime": 2.53,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.9969,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
