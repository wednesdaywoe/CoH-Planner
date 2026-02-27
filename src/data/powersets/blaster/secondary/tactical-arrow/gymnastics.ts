/**
 * Gymnastics
 * Toggle: Self +Recharge, +DEF(All), +SPD, +Res(Slow, Knockback)
 *
 * Source: blaster_support/tactical_arrow/quickness.json
 */

import type { Power } from '@/types';

export const Gymnastics: Power = {
  "name": "Gymnastics",
  "internalName": "Quickness",
  "available": 23,
  "description": "Years of training have made you extremely agile and quick on your feet. This power slightly increases your defense, attack rate and movement speed, in addition of protecting you from knockback.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Recharge, +DEF(All), +SPD, +Res(Slow, Knockback)",
  "icon": "tacticalarrow_quickness.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.13
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Run Speed",
    "Recharge",
    "Jump",
    "Fly",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Leaping",
    "Leaping & Sprints",
    "Running",
    "Running & Sprints",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      }
    },
    "knockup": {
      "scale": 9,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 9,
      "table": "Melee_Ones"
    },
    "rechargeBuff": {
      "scale": 0.4,
      "table": "Melee_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.4,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.4,
        "table": "Melee_Ones"
      }
    }
  }
};
