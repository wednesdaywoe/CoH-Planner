/**
 * Shinobi
 * Toggle: Self Stealth, +DEF(All), +Special
 *
 * Source: blaster_support/ninja_training/kyokan.json
 */

import type { Power } from '@/types';

export const Shinobi: Power = {
  "name": "Shinobi",
  "internalName": "Kyokan",
  "available": 9,
  "description": "A shinobi is a master of stealth and assassination. While this power is active you will be very hard to detect, and your first strike out of the shadows will deal extra damage. Even while detected, a shinobi is a deadly foe and able to deal lethal critical strikes.",
  "shortHelp": "Toggle: Self Stealth, +DEF(All), +Special",
  "icon": "ninjatools_assassin.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "To Hit Buff"
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
    "tohitBuff": {
      "scale": 0.5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 2,
      "table": "Melee_Buff_Dmg"
    },
    "stealth": {
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.3,
        "table": "Melee_Ones"
      }
    }
  }
};
