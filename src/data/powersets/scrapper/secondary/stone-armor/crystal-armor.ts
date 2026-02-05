/**
 * Crystal Armor
 * Toggle: Self +Recovery, +DEF(Energy, Negative), Res(DeBuff DEF)
 *
 * Source: scrapper_defense/stone_armor/crystal_armor.json
 */

import type { Power } from '@/types';

export const CrystalArmor: Power = {
  "name": "Crystal Armor",
  "internalName": "Crystal_Armor",
  "available": 19,
  "description": "While this power is active, your skin becomes encrusted in various quartz crystals. Crystal Armor makes Energy and Negative Energy attacks less likely to hit. This power also grants you an Endurance recovery buff and resistance to Defense DeBuffs.Crystal Armor also adds an Elusivity defense bonus to Energy and Negative Energy Attacks in PVP zones.Recharge: Fast.",
  "shortHelp": "Toggle: Self +Recovery, +DEF(Energy, Negative), Res(DeBuff DEF)",
  "icon": "stonearmor_crystalarmor.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "energy": {
        "scale": 1.6,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.6,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    },
    "recoveryBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
