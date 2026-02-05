/**
 * Flares
 * Ranged, DMG(Fire)
 *
 * Source: blaster_ranged/fire_blast/flares.json
 */

import type { Power } from '@/types';

export const Flares: Power = {
  "name": "Flares",
  "internalName": "Flares",
  "available": 0,
  "description": "A quick attack that throws Flares at the target. Little damage, but very fast.",
  "shortHelp": "Ranged, DMG(Fire)",
  "icon": "fireblast_flare.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 2.18,
    "endurance": 3.692,
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
      "scale": 0.71,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.15,
      "table": "Ranged_Damage",
      "duration": 3.1,
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
