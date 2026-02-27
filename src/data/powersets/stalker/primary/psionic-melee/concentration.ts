/**
 * Concentration
 * Self +DMG, +To Hit
 *
 * Source: stalker_melee/psionic_melee/concentration.json
 */

import type { Power } from '@/types';

export const Concentration: Power = {
  "name": "Concentration",
  "internalName": "Concentration",
  "available": 7,
  "description": "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.",
  "shortHelp": "Self +DMG, +To Hit",
  "icon": "psionicmelee_concentration.png",
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
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 8,
      "table": "Melee_Buff_Dmg"
    }
  }
};
