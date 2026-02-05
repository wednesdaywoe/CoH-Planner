/**
 * Regrowth
 * Ranged Facing Cone, Minor Ally Heal, Ally Moderate Healing Over Time, +1 Bloom
 *
 * Source: mastermind_buff/nature_affinity/regrowth.json
 */

import type { Power } from '@/types';

export const Regrowth: Power = {
  "name": "Regrowth",
  "internalName": "Regrowth",
  "available": 0,
  "description": "By channeling the energies present in nature you are able to immediately heal yourself and allies in front of you for a small amount of health and cause them to recover a small amount of health over time. Regrowth places a stack of Bloom on its target.Recharge: Moderate.",
  "shortHelp": "Ranged Facing Cone, Minor Ally Heal, Ally Moderate Healing Over Time, +1 Bloom",
  "icon": "natureaffinity_regrowth.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 45,
    "radius": 45,
    "arc": 1.5708,
    "recharge": 10,
    "endurance": 16.9,
    "castTime": 2,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 0.75,
      "table": "Ranged_Heal"
    },
    {
      "type": "Heal",
      "scale": 0.15,
      "table": "Ranged_Heal",
      "duration": 4.1,
      "tickRate": 1
    }
  ]
};
