/**
 * Fire Blast
 * Ranged, DMG(Fire), DoT(Fire)
 *
 * Source: sentinel_ranged/fire_blast/fire_blast.json
 */

import type { Power } from '@/types';

export const FireBlast: Power = {
  "name": "Fire Blast",
  "internalName": "Fire_Blast",
  "available": 0,
  "description": "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.Damage: Heavy.Recharge: Fast.",
  "shortHelp": "Ranged, DMG(Fire), DoT(Fire)",
  "icon": "fireblast_fireblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 6.03,
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
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1.16,
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
