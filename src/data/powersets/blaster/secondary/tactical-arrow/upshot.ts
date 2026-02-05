/**
 * Upshot
 * Self +DMG, +ToHit, +Recharge
 *
 * Source: blaster_support/tactical_arrow/upshot.json
 */

import type { Power } from '@/types';

export const Upshot: Power = {
  "name": "Upshot",
  "internalName": "Upshot",
  "available": 9,
  "description": "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit and recharge time of all your powers for 10 seconds.Recharge: Long.",
  "shortHelp": "Self +DMG, +ToHit, +Recharge",
  "icon": "tacticalarrow_buildup.png",
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
      "scale": 1.5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 6.5,
      "table": "Melee_Buff_Dmg"
    },
    "rechargeBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    }
  }
};
