/**
 * Build Up
 * Self +DMG, +To Hit
 *
 * Source: widow_training/night_widow_training/build_up.json
 */

import type { Power } from '@/types';

export const BuildUp: Power = {
  "name": "Build Up",
  "available": 7,
  "description": "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.  Notes: If you select this power, you may not also select Follow Up.",
  "shortHelp": "Self +DMG, +To Hit",
  "icon": "nightwidowtraining_buildup.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 0.73
  },
  "targetType": "Self",
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
