/**
 * Ionize
 * Self +DMG, +ToHit
 *
 * Source: blaster_support/radiation_manipulation/ionize.json
 */

import type { Power } from '@/types';

export const Ionize: Power = {
  "name": "Ionize",
  "internalName": "Ionize",
  "available": 9,
  "description": "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit.",
  "shortHelp": "Self +DMG, +ToHit",
  "icon": "atomicmanipulation_buildup.png",
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
