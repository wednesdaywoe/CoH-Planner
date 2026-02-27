/**
 * Fortification
 * Toggle: Self +Res(Disorient, Hold, Immobilize, Sleep, All DMG but Psionics)
 *
 * Source: training_gadgets/crab_spider_training/fortification.json
 */

import type { Power } from '@/types';

export const Fortification: Power = {
  "name": "Fortification",
  "available": 23,
  "description": "Crab Spiders armor may be reinforced to become far more resistant to all types of damage except Psionics, as well as increasing protection to Sleep, Hold, Immobilization and Disorient effects.",
  "shortHelp": "Toggle: Self +Res(Disorient, Hold, Immobilize, Sleep, All DMG but Psionics)",
  "icon": "crabspidertraining_fortification.png",
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
    "recharge": 3,
    "endurance": 0.104,
    "castTime": 2.33
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 24,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
      "mag": 1,
      "scale": 24,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 24,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 24,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75
  }
};
