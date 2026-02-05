/**
 * Superior Invisibility
 * Toggle: Self Stealth, +DEF(All)
 *
 * Source: controller_control/illusion_control/invisibility.json
 */

import type { Power } from '@/types';

export const SuperiorInvisibility: Power = {
  "name": "Superior Invisibility",
  "internalName": "Invisibility",
  "available": 7,
  "description": "You can bend light around yourself to become completely Invisible. While this power is active, you are all but impossible to detect, and have an extremely high Defense bonus to all attacks. Superior Invisibility is the only toggle invisibility power that allows you to attack while it is active, although you will lose some of your defense bonus if you do so.",
  "shortHelp": "Toggle: Self Stealth, +DEF(All)",
  "icon": "illusions_invisibility.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.182,
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
      "translucency": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 1000,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 200,
        "table": "Melee_Ones"
      }
    },
    "threatDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
