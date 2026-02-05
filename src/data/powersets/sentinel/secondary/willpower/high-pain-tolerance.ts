/**
 * High Pain Tolerance
 * Auto: Self +Res (All), +MaxHealth
 *
 * Source: sentinel_defense/willpower/high_pain_tolerance.json
 */

import type { Power } from '@/types';

export const HighPainTolerance: Power = {
  "name": "High Pain Tolerance",
  "internalName": "High_Pain_Tolerance",
  "available": 0,
  "description": "You have a greater tolerance to pain than others. You are also slightly resistant to all types of damage. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (All), +MaxHealth",
  "icon": "willpower_highpaintolerance.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    "resistance": {
      "smashing": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
