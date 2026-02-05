/**
 * Scream
 * Ranged, DMG(Energy/Smash), Foe -Res(All)
 *
 * Source: dominator_assault/sonic_assault/scream.json
 */

import type { Power } from '@/types';

export const Scream: Power = {
  "name": "Scream",
  "internalName": "Scream",
  "available": 3,
  "description": "Your Scream can cause serious damage to a target. This power applies Lingering Sonic Vibrations that lower resistance for 10s.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe -Res(All)",
  "icon": "sonicmanipulation_scream.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.47
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
      "scale": 0.132,
      "table": "Ranged_Damage",
      "duration": 1.05,
      "tickRate": 0.25
    },
    {
      "type": "Energy",
      "scale": 0.132,
      "table": "Ranged_Damage",
      "duration": 1.05,
      "tickRate": 0.25
    }
  ]
};
