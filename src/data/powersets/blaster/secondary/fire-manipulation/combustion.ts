/**
 * Combustion
 * Melee (AoE), DoT (Fire)
 *
 * Source: blaster_support/fire_manipulation/combustion.json
 */

import type { Power } from '@/types';

export const Combustion: Power = {
  "name": "Combustion",
  "internalName": "Combustion",
  "available": 3,
  "description": "Your mastery of fire allows you to violently raise the temperature around yourself in an attempt to spontaneously combust any nearby foes and set them ablaze, dealing damage over time.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Melee (AoE), DoT (Fire)",
  "icon": "firemanipulation_combustion.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 15,
    "endurance": 13,
    "castTime": 2.4,
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
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.5,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 7.1,
      "tickRate": 0.75
    }
  ],
  "effects": {
    "damageBuff": {
      "scale": 0.061,
      "table": "Melee_Ones"
    }
  }
};
