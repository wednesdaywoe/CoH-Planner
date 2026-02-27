/**
 * Second Wind
 * Self +Max HP, Rez(Special)
 *
 * Source: brute_defense/regeneration/dull_pain.json
 */

import type { Power } from '@/types';

export const SecondWind: Power = {
  "name": "Second Wind",
  "internalName": "Dull_Pain",
  "available": 27,
  "description": "When you use this power you will recover a percentage of your missing health, in addition to increasing your maximum hit points. Should you fall in battle after using this power, you can stand up and fight again. If used while defeated, you will enter stand back up and be protected from XP Debt for 90 seconds and immune to most damage for 15 seconds.Note: the self resurect granted if this power is activated while alive can not be enhanced.",
  "shortHelp": "Self +Max HP, Rez(Special)",
  "icon": "regeneration_dullpain.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 360,
    "endurance": 10.4,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 1.0,
      "table": "Melee_HealSelf"
    },
    "buffDuration": 120
  }
};
