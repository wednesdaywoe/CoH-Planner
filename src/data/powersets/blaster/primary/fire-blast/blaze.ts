/**
 * Blaze
 * Ranged, DMG(Fire)
 *
 * Source: blaster_ranged/fire_blast/blaze.json
 */

import type { Power } from '@/types';

export const Blaze: Power = {
  "name": "Blaze",
  "internalName": "Blaze",
  "available": 17,
  "description": "A devastating flame attack.",
  "shortHelp": "Ranged, DMG(Fire)",
  "icon": "fireblast_blaze.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.4,
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
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 2.12,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.225,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
