/**
 * True Grit
 * Auto: Self +Res (Cold, Energy, Fire, Negative Energy, Toxic), +MaxHealth
 *
 * Source: brute_defense/shield_defense/true_grit.json
 */

import type { Power } from '@/types';

export const TrueGrit: Power = {
  "name": "True Grit",
  "internalName": "True_Grit",
  "available": 3,
  "description": "Your intense training has left you tougher than even the hardiest of heroes. You gain additional hit points and resistance to fire, cold, energy, negative energy and toxic damage sources. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (Cold, Energy, Fire, Negative Energy, Toxic), +MaxHealth",
  "icon": "shielddefense_truegrit.png",
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
      "fire": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
