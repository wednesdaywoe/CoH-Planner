/**
 * Flares
 * Ranged, Light DMG(Fire)
 *
 * Source: dominator_assault/fiery_assault/flares.json
 */

import type { Power } from '@/types';

export const Flares: Power = {
  "name": "Flares",
  "internalName": "Flares",
  "available": 0,
  "description": "A quick attack that throws Flares at the target.Damage: Light.Recharge: Very Fast.",
  "shortHelp": "Ranged, Light DMG(Fire)",
  "icon": "fireassault_flare.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 3,
    "endurance": 4.368,
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
      "scale": 0.588,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.2898,
      "table": "Ranged_Damage"
    }
  ]
};
