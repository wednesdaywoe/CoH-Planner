/**
 * Aim
 * Self +To Hit, +DMG
 *
 * Source: corruptor_ranged/ice_blast/aim.json
 */

import type { Power } from '@/types';

export const Aim: Power = {
  "name": "Aim",
  "internalName": "Aim",
  "available": 5,
  "description": "Greatly increases your chance to hit with attacks for a few seconds. Slightly increases damage.",
  "shortHelp": "Self +To Hit, +DMG",
  "icon": "iceblast_buildup.png",
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
