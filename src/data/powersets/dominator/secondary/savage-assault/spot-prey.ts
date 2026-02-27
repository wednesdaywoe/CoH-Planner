/**
 * Spot Prey
 * Self +DMG, +To Hit, +Perception
 *
 * Source: dominator_assault/savage_assault/spot_prey.json
 */

import type { Power } from '@/types';

export const SpotPrey: Power = {
  "name": "Spot Prey",
  "internalName": "Spot_Prey",
  "available": 15,
  "description": "Greatly boosts your attacks for a few seconds. Slightly increases perception and chance to hit.Recharge: Long.",
  "shortHelp": "Self +DMG, +To Hit, +Perception",
  "icon": "savagemelee_aim.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    },
    "perceptionBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
