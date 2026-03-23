/**
 * Flamethrower
 * Ranged (Cone), DoT(Fire)
 *
 * Source: corruptor_ranged/assault_rifle/flamethrower.json
 */

import type { Power } from '@/types';

export const Flamethrower: Power = {
  "name": "Flamethrower",
  "internalName": "Flamethrower",
  "available": 17,
  "description": "Spews forth a cone of flames from underneath the barrel of your assault rifle, setting foes on fire. Very accurate and very deadly at medium range.",
  "shortHelp": "Ranged (Cone), DoT(Fire)",
  "icon": "assaultweapons_arflamethrower.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.3,
    "range": 40,
    "radius": 40,
    "arc": 0.7854,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.33,
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
    "Corruptor Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.3872,
    "table": "Ranged_Damage",
    "duration": 4.7,
    "tickRate": 1
  }
};
