/**
 * Serum
 * Self Heal, +Max HP
 *
 * Source: arachnos-soldier/crab-spider-training
 */

import type { Power } from '@/types';

export const Serum: Power = {
  "name": "Serum",
  "available": 23,
  "description": "You can activate this power to increase your maximum Hit Points for a short time.",
  "shortHelp": "Self Heal, +Max HP",
  "icon": "crabspidertraining_serum.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 360,
    "endurance": 10.4,
    "castTime": 1.3
  },
  "targetType": "Self"
};
