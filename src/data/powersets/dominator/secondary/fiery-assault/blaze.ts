/**
 * Blaze
 * Ranged, Superior DMG(Fire)
 *
 * Source: dominator_assault/fiery_assault/blaze.json
 */

import type { Power } from '@/types';

export const Blaze: Power = {
  "name": "Blaze",
  "internalName": "Blaze",
  "available": 29,
  "description": "A devastating flame attack.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Ranged, Superior DMG(Fire)",
  "icon": "fireassault_blaze.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 12,
    "endurance": 11.856,
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 2.28,
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
