/**
 * Focus Chi
 * Self +DMG, +To Hit
 *
 * Source: stalker_melee/martial_arts/focus_chi.json
 */

import type { Power } from '@/types';

export const FocusChi: Power = {
  "name": "Focus Chi",
  "internalName": "Focus_Chi",
  "available": 7,
  "description": "Tapping into your inner Chi greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
  "shortHelp": "Self +DMG, +To Hit",
  "icon": "martialarts_focuschi.png",
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
      "scale": 8,
      "table": "Melee_Buff_Dmg"
    }
  }
};
