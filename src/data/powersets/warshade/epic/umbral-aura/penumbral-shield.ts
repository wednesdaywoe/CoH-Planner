/**
 * Penumbral Shield
 * Toggle: Self +Res(Fire, Cold, Toxic)
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const PenumbralShield: Power = {
  "name": "Penumbral Shield",
  "available": 9,
  "description": "When you toggle on Penumbral Shield, you become highly resistant to Fire, Cold, and Toxic damage.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Fire, Cold, Toxic)",
  "icon": "umbralaura_penumbralshield.png",
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
