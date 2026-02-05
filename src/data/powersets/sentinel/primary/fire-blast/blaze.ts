/**
 * Blaze
 * Ranged, DMG(Fire), DoT(Fire)
 *
 * Source: sentinel_ranged/fire_blast/blaze.json
 */

import type { Power } from '@/types';

export const Blaze: Power = {
  "name": "Blaze",
  "internalName": "Blaze",
  "available": 5,
  "description": "A devastating flame attack.Damage: Extreme.Recharge: Moderate.",
  "shortHelp": "Ranged, DMG(Fire), DoT(Fire)",
  "icon": "fireblast_blaze.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1.96,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.225,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ]
};
