/**
 * Arctic Fog
 * Toggle: PBAoE, Team Stealth, +DEF, +Res(Fire, Cold, Energy, Slow)
 *
 * Source: defender_buff/cold_domination/arctic_fog.json
 */

import type { Power } from '@/types';

export const ArcticFog: Power = {
  "name": "Arctic Fog",
  "internalName": "Arctic_Fog",
  "available": 11,
  "description": "Your mastery of Cold allows you to hide yourself and all nearby allies within thick Arctic Fog. Arctic Fog makes you and your allies harder to see and increases your Defense to area effect, melee and ranged attacks, as well as your resistance to Slow, Fire, Cold, and Energy damage.",
  "shortHelp": "Toggle: PBAoE, Team Stealth, +DEF, +Res(Fire, Cold, Energy, Slow)",
  "icon": "colddomination_arcticfog.png",
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
    "Resistance",
    "EnduranceReduction",
    "Recharge",
    "Defense"
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
    "movement": {
      "runSpeed": {
        "scale": 0.6,
        "table": "Ranged_Ones"
      },
      "flySpeed": {
        "scale": 0.6,
        "table": "Ranged_Ones"
      },
      "jumpSpeed": {
        "scale": 0.6,
        "table": "Ranged_Ones"
      },
      "jumpHeight": {
        "scale": 0.6,
        "table": "Ranged_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.6,
      "table": "Ranged_Ones"
    }
  }
};
