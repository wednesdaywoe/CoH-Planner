/**
 * Frozen Armor
 * Self, +Def(Smash, Lethal), +Res(Cold, Fire, DeBuff DEF)
 *
 * Source: stalker_defense/ice_armor/frozen_armor.json
 */

import type { Power } from '@/types';

export const FrozenArmor: Power = {
  "name": "Frozen Armor",
  "internalName": "Frozen_Armor",
  "available": 0,
  "description": "Activating this power covers you in a thick layer of Hoarfrost. The frost can absorb the impact from enemy attacks, effectively increasing your maximum Hit Points for a short time. Hoarfrost also grants you resistance to Toxic Damage.This power is mutually exclusive from Rime",
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
    "Recharge"
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
