/**
 * Frozen Armor
 * Self, +Def(Smash, Lethal), +Res(Cold, Fire, DeBuff DEF)
 *
 * Source: sentinel_defense/ice_armor/frozen_armor.json
 */

import type { Power } from '@/types';

export const FrozenArmor: Power = {
  "name": "Frozen Armor",
  "internalName": "Frozen_Armor",
  "available": 0,
  "description": "While this power is active, you coat yourself in rock hard Frozen Armor. The hardness of the Frozen Armor offers good defense to Smashing and Lethal attack as well as reduces Cold damage. Also, Fire attacks deal slightly less damage and you can resist Defense DeBuffs.",
  "shortHelp": "Self, +Def(Smash, Lethal), +Res(Cold, Fire, DeBuff DEF)",
  "icon": "icearmor_icearmor.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "smashing": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      }
    },
    "resistance": {
      "cold": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
