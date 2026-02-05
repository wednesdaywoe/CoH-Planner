/**
 * Temporal Selection
 * Ally +Damage, +Recharge, +Regeneration
 *
 * Source: corruptor_buff/time_manipulation/temporal_selection.json
 */

import type { Power } from '@/types';

export const TemporalSelection: Power = {
  "name": "Temporal Selection",
  "internalName": "Temporal_Selection",
  "available": 9,
  "description": "You distort time around an ally, selecting a period of time where their abilities are at their highest. Their damage, attack rate and regeneration rates are dramatically increased for a brief period. This power places the Accelerated effect on the target. While this is in effect, the target has any healing and healing over time effects from Temporal Mending or Chrono Shift significantly increased.Recharge: Long.",
  "shortHelp": "Ally +Damage, +Recharge, +Regeneration",
  "icon": "timemanipulation_temporalselection.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 120,
    "endurance": 10.4,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.3,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 2.5,
      "table": "Ranged_Buff_Dmg"
    },
    "regenBuff": {
      "scale": 1.5,
      "table": "Ranged_Ones"
    }
  }
};
