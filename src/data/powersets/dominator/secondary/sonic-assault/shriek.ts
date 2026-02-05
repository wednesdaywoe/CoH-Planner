/**
 * Shriek
 * Ranged, DMG(Energy/Smash), Foe -Res(All)
 *
 * Source: dominator_assault/sonic_assault/shriek.json
 */

import type { Power } from '@/types';

export const Shriek: Power = {
  "name": "Shriek",
  "internalName": "Shriek",
  "available": 0,
  "description": "You let forth a quick Shriek, damaging your target. This power applies Short Sonic Vibrations that lower resistance for 8s.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe -Res(All)",
  "icon": "sonicmanipulation_shriek.png",
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
      "type": "Smashing",
      "scale": 0.42,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.42,
      "table": "Ranged_Damage"
    }
  ]
};
