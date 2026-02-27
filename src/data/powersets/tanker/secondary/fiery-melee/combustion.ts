/**
 * Combustion
 * PBAoE, DoT (Fire)
 *
 * Source: tanker_melee/fiery_melee/combustion.json
 */

import type { Power } from '@/types';

export const Combustion: Power = {
  "name": "Combustion",
  "internalName": "Combustion",
  "available": 3,
  "description": "Your mastery of fire allows you to violently raise the temperature around yourself in an attempt to spontaneously combust any nearby foes and set them ablaze, dealing damage over time.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE, DoT (Fire)",
  "icon": "fieryfray_combustion.png",
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
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
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
      "tickRate": 1
    }
  ]
};
