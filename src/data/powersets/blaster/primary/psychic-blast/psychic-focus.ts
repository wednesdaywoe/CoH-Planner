/**
 * Psychic Focus
 * Self +To Hit, +DMG
 *
 * Source: blaster_ranged/psychic_blast/aim.json
 */

import type { Power } from '@/types';

export const PsychicFocus: Power = {
  "name": "Psychic Focus",
  "internalName": "Aim",
  "available": 7,
  "description": "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage.",
  "shortHelp": "Self +To Hit, +DMG",
  "icon": "psychicblast_aim.png",
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
      "scale": 5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
