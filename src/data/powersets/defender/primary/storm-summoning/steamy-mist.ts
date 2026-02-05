/**
 * Steamy Mist
 * Toggle: PBAoE, Team Stealth, +DEF(All), +Res(Fire, Cold, Energy, Confuse)
 *
 * Source: defender_buff/storm_summoning/steamy_mist.json
 */

import type { Power } from '@/types';

export const SteamyMist: Power = {
  "name": "Steamy Mist",
  "internalName": "Steamy_Mist",
  "available": 5,
  "description": "Your mastery of the elements allows you to hide yourself and all nearby allies within a Steamy Mist. Steamy Mist makes you and your allies harder to see and increases your Defense bonus to all attacks, while reducing Fire, Cold, and Energy damage, as well as your Foes ability to Confuse you.",
  "shortHelp": "Toggle: PBAoE, Team Stealth, +DEF(All), +Res(Fire, Cold, Energy, Confuse)",
  "icon": "stormsummoning_fog.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 40,
    "recharge": 15,
    "endurance": 0.26,
    "castTime": 1.87,
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
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 5,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 0.75
  }
};
