/**
 * Rock Armor
 * Toggle: Self +DEF(Lethal, Smashing), Res(DeBuff DEF)
 *
 * Source: brute_defense/stone_armor/rock_armor.json
 */

import type { Power } from '@/types';

export const RockArmor: Power = {
  "name": "Rock Armor",
  "internalName": "Rock_Armor",
  "available": 0,
  "description": "Your skin becomes stone while this power is active. Stone Armor protects you from Smashing and Lethal attacks. They are less likely to land and affect you. Stone Armor also grants you resistance to Defense DeBuffs.Stone Armor also adds an Elusivity defense bonus to Smashing and Lethal Attacks in PVP zones.Cannot be active at the same time as Granite Armor.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Lethal, Smashing), Res(DeBuff DEF)",
  "icon": "stonearmor_stonearmor.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
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
        "scale": 1.6,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.6,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  },
  "requires": "!Brute_Melee.Claws"
};
