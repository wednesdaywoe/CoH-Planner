/**
 * Beryl Crystals
 * Toggle: Self Res(Confuse, Perception, ToHit), +Perception, Accuracy
 *
 * Source: blaster_support/earth_manipulation/beryl_crystals.json
 */

import type { Power } from '@/types';

export const BerylCrystals: Power = {
  "name": "Beryl Crystals",
  "internalName": "Beryl_Crystals",
  "available": 23,
  "description": "Activating this power summons several rare Beryl Crystals to orbit around you. These Crystals can bring clarity of the mind and increase your Accuracy, Perception to see hidden foes, and grant resistance to Confusion, Perception and ToHit debuffs.Recharge: Fast.",
  "shortHelp": "Toggle: Self Res(Confuse, Perception, ToHit), +Perception, Accuracy",
  "icon": "earthmanip_beryl.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 0.75,
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "tohitBuff": {
      "scale": 1,
      "table": "Melee_Res_Boolean"
    }
  }
};
