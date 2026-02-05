/**
 * Shockwave
 * Ranged (Cone), Light DMG(Smashing/Energy), Foe Knockback
 *
 * Source: defender_ranged/sonic_attack/shockwave.json
 */

import type { Power } from '@/types';

export const Shockwave: Power = {
  "name": "Shockwave",
  "internalName": "Shockwave",
  "available": 9,
  "description": "You can call forth a tremendous Shockwave that knocks back foes and deals Smashing damage in a wide cone area.",
  "shortHelp": "Ranged (Cone), Light DMG(Smashing/Energy), Foe Knockback",
  "icon": "sonicblast_knockback.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 50,
    "arc": 0.5236,
    "recharge": 11,
    "endurance": 11.024,
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
    "Defender Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.4326,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.4326,
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
