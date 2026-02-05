/**
 * Spin
 * PBAoE Melee, DMG(Lethal)
 *
 * Source: brute_melee/claws/spin.json
 */

import type { Power } from '@/types';

export const Spin: Power = {
  "name": "Spin",
  "internalName": "Spin",
  "available": 5,
  "description": "You spin around in a circle, attacking everyone within melee range with a Strike attack.",
  "shortHelp": "PBAoE Melee, DMG(Lethal)",
  "icon": "claws_spinningclawsattack.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 14,
    "endurance": 13.1456,
    "castTime": 2.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.89,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.8505,
      "table": "Melee_Damage"
    }
  ]
};
