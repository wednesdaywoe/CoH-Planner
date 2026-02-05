/**
 * Ice Slick
 * Target (Location AoE), Foe DoT (Cold), Knockdown, -SPD
 *
 * Source: dominator_control/ice_control/ice_slick.json
 */

import type { Power } from '@/types';

export const IceSlick: Power = {
  "name": "Ice Slick",
  "internalName": "Ice_Slick",
  "available": 11,
  "description": "You can create a large patch of ice at a targeted area, causing all foes that pass through it to lose their footing. Those caught in the Ice Slick are dramatically slowed, take cold damage over time, tend to fall down and will be unable to jump.",
  "shortHelp": "Target (Location AoE), Foe DoT (Cold), Knockdown, -SPD",
  "icon": "iceformation_iceslick.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_IceSlick",
      "duration": 30
    }
  }
};
