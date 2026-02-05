/**
 * Gravity Shield
 * Toggle: Self +Res(Smash, Lethal)
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const GravityShield: Power = {
  "name": "Gravity Shield",
  "available": 0,
  "description": "When you toggle on Gravity Shield, you become highly resistant to Smashing and Lethal damage, deflecting away such physical attacks.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Smash, Lethal)",
  "icon": "umbralaura_gravityshield.png",
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
