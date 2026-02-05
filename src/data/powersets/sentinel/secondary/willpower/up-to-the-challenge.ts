/**
 * Up to the Challenge
 * Toggle: Self +Regen
 *
 * Source: sentinel_defense/willpower/up_to_the_challenge.json
 */

import type { Power } from '@/types';

export const UptotheChallenge: Power = {
  "name": "Up to the Challenge",
  "internalName": "Up_to_the_Challenge",
  "available": 15,
  "description": "Regardless of the odds against you, you are determined to go on. Your ability to regenerate health is greatly increased at all times.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Regen",
  "icon": "willpower_risetothechallenge.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.208,
    "castTime": 3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 2,
      "table": "Melee_Ones"
    }
  }
};
