/**
 * Meltdown
 * Self, +Res(All), +Recovery, +DMG(All)
 *
 * Source: sentinel_defense/radiation_armor/meltdown.json
 */

import type { Power } from '@/types';

export const Meltdown: Power = {
  "name": "Meltdown",
  "internalName": "Meltdown",
  "available": 29,
  "description": "After building up a dangerous amount of radiation you release it to both shield and empower yourself. While active you will gain a good amount of damage resistance to all types of damage, recover endurance more quickly and deal more damage for a short time. When this power wears off you will lose a small amount endurance.",
  "shortHelp": "Self, +Res(All), +Recovery, +DMG(All)",
  "icon": "radiationarmor_meltdown.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 480,
    "endurance": 2.6,
    "castTime": 2.93
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "recoveryBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 3.3,
      "table": "Melee_Buff_Dmg"
    },
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 100,
      "table": "Melee_Ones"
    }
  }
};
