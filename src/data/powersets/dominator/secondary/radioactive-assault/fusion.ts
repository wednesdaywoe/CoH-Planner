/**
 * Fusion
 * Self +DMG, +To Hit, Special
 *
 * Source: dominator_assault/radioactive_assault/fusion.json
 */

import type { Power } from '@/types';

export const Fusion: Power = {
  "name": "Fusion",
  "internalName": "Fusion",
  "available": 15,
  "description": "Fusion boosts your damage and chance to hit moderately and also causes your next few attacks to have a 100% chance to inflict Contaminated on your enemies.Recharge: Long.",
  "shortHelp": "Self +DMG, +To Hit, Special",
  "icon": "radioactiveassault_buildup.png",
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
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
