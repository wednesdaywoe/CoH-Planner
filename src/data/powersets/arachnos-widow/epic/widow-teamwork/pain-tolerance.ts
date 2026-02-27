/**
 * Pain Tolerance
 * Auto: Self Res (All DMG but Psi), +MaxHealth
 *
 * Source: teamwork/widow_teamwork/pain_tolerance.json
 */

import type { Power } from '@/types';

export const PainTolerance: Power = {
  "name": "Pain Tolerance",
  "available": 0,
  "description": "Night Widows who possess Pain Tolerance are resistant to most damage types, and gain additional hit points. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self Res (All DMG but Psi), +MaxHealth",
  "icon": "widowteamwork_paintolerance.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "maxHPBuff": {
      "scale": 1.5,
      "table": "Melee_HealSelf"
    }
  }
};
