/**
 * Shout
 * Ranged, DMG(Energy/Smash), Foe -Res(All)
 *
 * Source: dominator_assault/sonic_assault/shout.json
 */

import type { Power } from '@/types';

export const Shout: Power = {
  "name": "Shout",
  "internalName": "Shout",
  "available": 27,
  "description": "You blast your foe with a tremendous Shout, damaging them. This power applies Extended Sonic Vibrations that lower resistance for 12s.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe -Res(All)",
  "icon": "sonicmanipulation_shout.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2
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
      "scale": 1.3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.3,
      "table": "Ranged_Damage"
    }
  ]
};
