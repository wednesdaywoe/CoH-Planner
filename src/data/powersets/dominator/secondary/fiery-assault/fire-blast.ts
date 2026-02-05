/**
 * Fire Blast
 * Ranged, High DMG(Fire)
 *
 * Source: dominator_assault/fiery_assault/fire_blast.json
 */

import type { Power } from '@/types';

export const FireBlast: Power = {
  "name": "Fire Blast",
  "internalName": "Fire_Blast",
  "available": 9,
  "description": "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.Damage: High.Recharge: Moderate.",
  "shortHelp": "Ranged, High DMG(Fire)",
  "icon": "fireassault_fireblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.2
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
      "scale": 1.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.15,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ]
};
