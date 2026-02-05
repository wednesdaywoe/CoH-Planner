/**
 * Shadow Fall
 * Toggle: PBAoE, Team Stealth, +DEF(All), +Res(Energy, Negative, Psionics, Fear)
 *
 * Source: defender_buff/dark_miasma/shadow_fall.json
 */

import type { Power } from '@/types';

export const ShadowFall: Power = {
  "name": "Shadow Fall",
  "internalName": "Shadow_Fall",
  "available": 7,
  "description": "Envelops you and your nearby teammates in a shroud of darkness. Shadow Fall does not grant Invisibility, but it does make you harder to detect. Even if you are discovered, Shadow Fall grants a bonus to Defense bonus to all attacks and Resistance to Fear, while reducing Energy, Negative Energy, and Psionic Damage.",
  "shortHelp": "Toggle: PBAoE, Team Stealth, +DEF(All), +Res(Energy, Negative, Psionics, Fear)",
  "icon": "darkmiasma_shadowfall.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 40,
    "recharge": 15,
    "endurance": 0.26,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      }
    },
    "stealth": {
      "translucency": {
        "scale": 0.7,
        "table": "Ranged_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      }
    },
    "resistance": {
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    },
    "fear": {
      "mag": 1,
      "scale": 5,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 0.75
  }
};
