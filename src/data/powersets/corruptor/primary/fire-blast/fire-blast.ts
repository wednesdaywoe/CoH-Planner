/**
 * Fire Blast
 * Ranged, DMG(Fire)
 *
 * Source: corruptor_ranged/fire_blast/fire_blast.json
 */

import type { Power } from '@/types';

export const FireBlast: Power = {
  "name": "Fire Blast",
  "internalName": "Fire_Blast",
  "available": 0,
  "description": "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.",
  "shortHelp": "Ranged, DMG(Fire)",
  "icon": "fireblast_fireblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
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
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.15,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ]
};
