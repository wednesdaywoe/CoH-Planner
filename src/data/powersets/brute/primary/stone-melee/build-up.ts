/**
 * Build Up
 * Self +DMG, +To Hit
 *
 * Source: brute_melee/stone_melee/build_up.json
 */

import type { Power } from '@/types';

export const BuildUp: Power = {
  "name": "Build Up",
  "internalName": "Build_Up",
  "available": 5,
  "description": "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
  "shortHelp": "Self +DMG, +To Hit",
  "icon": "stonemelee_buildup.png",
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
