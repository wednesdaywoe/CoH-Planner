/**
 * Plasma Shield
 * Toggle: Self +Res(Energy, Negative, Fire, Hold, Sleep)
 *
 * Source: brute_defense/fiery_aura/plasma_shield.json
 */

import type { Power } from '@/types';

export const PlasmaShield: Power = {
  "name": "Plasma Shield",
  "internalName": "Plasma_Shield",
  "available": 15,
  "description": "While this power is active, you are surrounded by pure plasma. The Plasma Shield gives you resistance to Energy, Negative Energy, and Fire damage. Plasma Shield also gives your protection from Sleep and Hold effects.Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Energy, Negative, Fire, Hold, Sleep)",
  "icon": "flamingshield_plasmasheild.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 3
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "fire": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    }
  }
};
