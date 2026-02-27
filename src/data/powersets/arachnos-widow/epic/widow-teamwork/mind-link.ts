/**
 * Mind Link
 * PBAoE Team +To Hit, +DEF (All), +RES (Psionic)
 *
 * Source: teamwork/widow_teamwork/nw_mind_link.json
 */

import type { Power } from '@/types';

export const MindLink: Power = {
  "name": "Mind Link",
  "available": 23,
  "description": "Your Mind Link Power will enable you to link the minds of all your teammates who are near you for the next 90 seconds. This shared link improves your team's chance to hit foes, your defensive abilities and dramatically reduces psionic damage.",
  "shortHelp": "PBAoE Team +To Hit, +DEF (All), +RES (Psionic)",
  "icon": "widowteamwork_mindlink.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "ToHit",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "To Hit Buff"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 240,
    "endurance": 10.192,
    "castTime": 2.97,
    "radius": 35,
    "maxTargets": 255
  },
  "targetType": "Self",
  "effects": {
    "tohitBuff": {
      "scale": 0.5,
      "table": "Melee_Buff_ToHit"
    },
    "resistance": {
      "psionic": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
