/**
 * Shining Shield
 * Toggle: Self +Res(Smash, Lethal)
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const ShiningShield: Power = {
  "name": "Shining Shield",
  "available": 0,
  "description": "When you toggle on your Shining Shield, you create an energy barrier that grants you high resistance to Smashing and Lethal damage.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Smash, Lethal)",
  "icon": "luminousaura_shiningshield.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.67
  },
  "targetType": "Self"
};
