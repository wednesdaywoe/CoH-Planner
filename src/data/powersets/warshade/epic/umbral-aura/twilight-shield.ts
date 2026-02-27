/**
 * Twilight Shield
 * Toggle: Self +Res(Energy, Negative)
 *
 * Source: warshade_defensive/umbral_aura/twilight_shield.json
 */

import type { Power } from '@/types';

export const TwilightShield: Power = {
  "name": "Twilight Shield",
  "available": 15,
  "description": "When you toggle on Twilight Shield, you become highly resistant to Energy and Negative Energy damage.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Energy, Negative)",
  "icon": "umbralaura_twilightshield.png",
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
    "castTime": 0.73
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "energy": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
