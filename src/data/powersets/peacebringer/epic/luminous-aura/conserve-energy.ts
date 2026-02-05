/**
 * Conserve Energy
 * Self Endurance Discount
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const ConserveEnergy: Power = {
  "name": "Conserve Energy",
  "available": 23,
  "description": "You can focus for a moment to Conserve your Energy. After activating this power, you expend less Endurance on all other powers for a while.  Recharge: Very Long.",
  "shortHelp": "Self Endurance Discount",
  "icon": "luminousaura_conserveenergy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "recharge": 600,
    "endurance": 7.8,
    "castTime": 1.17
  },
  "targetType": "Self"
};
