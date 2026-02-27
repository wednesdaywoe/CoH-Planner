/**
 * Cloak of Darkness
 * Toggle: Self Stealth, +DEF(All), +Perception, Res (Immobilize)
 *
 * Source: tanker_defense/dark_armor/cloak_of_darkness.json
 */

import type { Power } from '@/types';

export const CloakofDarkness: Power = {
  "name": "Cloak of Darkness",
  "internalName": "Cloak_of_Darkness",
  "available": 11,
  "description": "A shroud of Netherworld darkness envelops you, making you difficult to spot at a distance. You can be seen only at close range, or if you attack a target. Even if seen, the Cloak of Darkness grants you a bonus to Defense to all attacks and some protection from Immobilization. This Netherworld Cloak also allows you to see things in a new light, allowing you to better see stealthy foes.",
  "shortHelp": "Toggle: Self Stealth, +DEF(All), +Perception, Res (Immobilize)",
  "icon": "darkarmor_cloakofdarkness.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 1.17
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
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
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
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "stealth": {
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      }
    }
  }
};
