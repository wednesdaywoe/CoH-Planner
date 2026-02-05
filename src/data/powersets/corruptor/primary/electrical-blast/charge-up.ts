/**
 * Charge Up
 * Self +To Hit, +DMG, +End Mod
 *
 * Source: corruptor_ranged/electrical_blast/aim.json
 */

import type { Power } from '@/types';

export const ChargeUp: Power = {
  "name": "Charge Up",
  "internalName": "Aim",
  "available": 7,
  "description": "Greatly increases the chance to hit of your attacks for a few seconds. Slightly increases damage and endurance modification.",
  "shortHelp": "Self +To Hit, +DMG, +End Mod",
  "icon": "electricalbolt_aim.png",
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
      "scale": 4,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 4,
      "table": "Melee_Buff_Dmg"
    },
    "enduranceGain": {
      "scale": 0.25,
      "table": "Ranged_EndDrain"
    }
  }
};
