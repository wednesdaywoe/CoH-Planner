/**
 * Wild Fortress
 * Toggle: Self +Absorb, +Recovery, +Resist(Toxic, Confuse)
 *
 * Source: blaster_support/plant_manipulation/wild_fortress.json
 */

import type { Power } from '@/types';

export const WildFortress: Power = {
  "name": "Wild Fortress",
  "internalName": "Wild_Fortress",
  "available": 19,
  "description": "You encase yourself in a protective barrier that will absorb a moderate amount of damage. Additionally, you will recover endurance faster and be resistant to toxic damage and have confusion protection.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Absorb, +Recovery, +Resist(Toxic, Confuse)",
  "icon": "plantmanipulation_wildfortress.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 0.15,
      "table": "Melee_HealSelf"
    },
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 2.5,
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
