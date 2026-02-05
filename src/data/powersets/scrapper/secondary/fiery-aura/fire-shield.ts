/**
 * Fire Shield
 * Toggle: Self +Res(Fire, Lethal, Smash, Cold, Disorient)
 *
 * Source: scrapper_defense/fiery_aura/fire_shield.json
 */

import type { Power } from '@/types';

export const FireShield: Power = {
  "name": "Fire Shield",
  "internalName": "Fire_Shield",
  "available": 0,
  "description": "While this power is active, Fire Shield gives you good resistance to Lethal, Smashing and Fire damage. Fire Shield also provides minimal resistance to Cold damage as well as protection from Disorient effects.Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Fire, Lethal, Smash, Cold, Disorient)",
  "icon": "flamingshield_flamingshield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75
  }
};
