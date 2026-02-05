/**
 * Paralytic Poison
 * Ranged Hold
 *
 * Source: corruptor_buff/poison/paralytic_poison.json
 */

import type { Power } from '@/types';

export const ParalyticPoison: Power = {
  "name": "Paralytic Poison",
  "internalName": "Paralytic_Poison",
  "available": 23,
  "description": "This Paralytic Poison viciously attacks a foe's nervous system and can leave an affected target completely Held and defenseless.Recharge: Slow.",
  "shortHelp": "Ranged Hold",
  "icon": "poison_paralytic.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 16,
    "endurance": 7.8,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    }
  }
};
