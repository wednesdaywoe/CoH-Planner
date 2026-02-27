/**
 * Brimstone Armor
 * Toggle: Self +Res(Fire, Cold, Toxic), +Special
 *
 * Source: stalker_defense/stone_armor/brimstone_armor.json
 */

import type { Power } from '@/types';

export const BrimstoneArmor: Power = {
  "name": "Brimstone Armor",
  "internalName": "Brimstone_Armor",
  "available": 23,
  "description": "While this power is active, your skin becomes encrusted in cracked magma. Brimstone Armor makes you highly resistant to Fire, Cold and Toxic damage, and helps your attacks set enemies on fire, delivering damage over time.Recharge: Fast.",
  "shortHelp": "Toggle: Self +Res(Fire, Cold, Toxic), +Special",
  "icon": "stonearmor_magmaarmor.png",
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
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "fire": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
