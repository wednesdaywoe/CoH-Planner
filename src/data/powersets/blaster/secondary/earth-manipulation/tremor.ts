/**
 * Tremor
 * PBAoE, Light DMG(Smashing), Knockback
 *
 * Source: blaster_support/earth_manipulation/tremor.json
 */

import type { Power } from '@/types';

export const Tremor: Power = {
  "name": "Tremor",
  "internalName": "Tremor",
  "available": 15,
  "description": "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range, while knocking them back.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE, Light DMG(Smashing), Knockback",
  "icon": "earthmanip_tremor.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.53,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.04,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
