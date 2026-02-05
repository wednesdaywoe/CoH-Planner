/**
 * Spin
 * PBAoE Melee, DMG(Lethal)
 *
 * Source: scrapper_melee/claws/spin.json
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
    "recharge": 9.2,
    "endurance": 9.152,
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
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.58,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1.58,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 1.58,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.711,
      "table": "Melee_Damage"
    }
  ]
};
