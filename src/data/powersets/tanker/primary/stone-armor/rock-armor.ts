/**
 * Rock Armor
 * Toggle: Self +DEF(Lethal, Smashing), Res(DeBuff DEF)
 *
 * Source: tanker_defense/stone_armor/stone_armor.json
 */

import type { Power } from '@/types';

export const RockArmor: Power = {
  "name": "Rock Armor",
  "internalName": "Stone_Armor",
  "available": 0,
  "description": "Your skin becomes stone while this power is active. Stone Armor protects you from Smashing and Lethal attacks. They are less likely to land and affect you. Stone Armor also grants you resistance to Defense DeBuffs.Cannot be active at the same time as Granite Armor.Recharge: Fast.",
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
  "requires": "!Tanker_Melee.Claws"
};
