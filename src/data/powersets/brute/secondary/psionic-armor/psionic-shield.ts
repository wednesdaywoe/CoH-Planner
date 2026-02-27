/**
 * Psionic Shield
 * Toggle: Self +Res(Fire, Cold, Energy, Negative, Toxic, End Drain)
 *
 * Source: brute_defense/psionic_armor/psionic_shield.json
 */

import type { Power } from '@/types';

export const PsionicShield: Power = {
  "name": "Psionic Shield",
  "internalName": "Psionic_Shield",
  "available": 0,
  "description": "This power generates a psionic shield that dampens most energy and elemental damage types while also reducing the effect of endurance drain effects.",
  "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative, Toxic, End Drain)",
  "icon": "psionicarmor_psionicshield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 1.17
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
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      }
    },
    "enduranceGain": {
      "scale": 0.75,
      "table": "Melee_Res_Boolean"
    }
  }
};
