/**
 * Chronos
 * Self +DMG, +Recharge, +ToHit, Special
 *
 * Source: blaster_support/time_manipulation/chronological_selection.json
 */

import type { Power } from '@/types';

export const Chronos: Power = {
  "name": "Chronos",
  "internalName": "Chronological_Selection",
  "available": 9,
  "description": "You distort time around you, selecting a period of time where your abilities are at your highest. Your damage, attack rate and chance to hit are dramatically increased for a brief period. This power places the Accelerated effect on you. While this is in effect, the target has any healing and healing over time effects from Temporal Healing or Time Lord significantly increased.Recharge: Long.",
  "shortHelp": "Self +DMG, +Recharge, +ToHit, Special",
  "icon": "timemanipulation_chronologicalselection.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 10.4,
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
    "rechargeBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
