/**
 * Eviscerate
 * Melee (Cone), DMG(Lethal), +Special
 *
 * Source: scrapper_melee/claws/eviscerate.json
 */

import type { Power } from '@/types';

export const Eviscerate: Power = {
  "name": "Eviscerate",
  "internalName": "Eviscerate",
  "available": 21,
  "description": "You spin and slash violently, Eviscerating all foes in a wide arc in front of you. This attack has an exceptionally good critical hit capability, better than other Claw attacks, that can sometimes deal double damage.",
  "shortHelp": "Melee (Cone), DMG(Lethal), +Special",
  "icon": "claws_evicerate.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 8.867,
    "endurance": 8.875,
    "castTime": 2.33,
    "maxTargets": 5
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
      "scale": 1.99,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1.99,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.8955,
      "table": "Melee_Damage"
    }
  ]
};
