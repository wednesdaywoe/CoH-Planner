/**
 * Blood Thirst
 * Self +DMG, +To Hit, +Special, +5 Blood Frenzy
 *
 * Source: scrapper_melee/savage_melee/blood_thirst.json
 */

import type { Power } from '@/types';

export const BloodThirst: Power = {
  "name": "Blood Thirst",
  "internalName": "Blood_Thirst",
  "available": 5,
  "description": "You unleash your frenzy, increasing your chance to inflict Bleed to 100% as well as increasing your damage and chance to hit moderately. Blood Thirst also grants 5 stacks of Frenzy Fury.",
  "shortHelp": "Self +DMG, +To Hit, +Special, +5 Blood Frenzy",
  "icon": "savagemelee_buildup.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 7.8,
    "castTime": 2
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
      "scale": 1,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 3.333,
      "table": "Melee_Buff_Dmg"
    }
  }
};
