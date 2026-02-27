/**
 * Power Armor
 * Auto: Self +MaxHP, +Resist(All DMG)
 *
 * Source: sentinel_defense/energy_aura/power_armor.json
 */

import type { Power } from '@/types';

export const PowerArmor: Power = {
  "name": "Power Armor",
  "internalName": "Power_Armor",
  "available": 19,
  "description": "Power Armor increases Hit Points and resistance to all damage types. This power is always on and costs no endurance.",
  "shortHelp": "Auto: Self +MaxHP, +Resist(All DMG)",
  "icon": "energyaura_powerarmor.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Resistance",
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
      "smashing": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
