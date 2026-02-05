/**
 * Energy Cloak
 * Toggle: Self Stealth, +DEF
 *
 * Source: brute_defense/energy_aura/energy_cloak.json
 */

import type { Power } from '@/types';

export const EnergyCloak: Power = {
  "name": "Energy Cloak",
  "internalName": "Energy_Cloak",
  "available": 19,
  "description": "The Energy Cloak bends light around you so you become partially invisible. While Cloaked you can only be seen at very close range. If you attack while Cloaked, you will be discovered. Even if discovered, you still maintain a Defense bonus to all attacks.",
  "shortHelp": "Toggle: Self Stealth, +DEF",
  "icon": "energyaura_cloak.png",
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
      "ranged": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      }
    },
    "stealth": {
      "stealthPvE": {
        "scale": 36.5,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.1,
        "table": "Melee_Ones"
      }
    }
  }
};
