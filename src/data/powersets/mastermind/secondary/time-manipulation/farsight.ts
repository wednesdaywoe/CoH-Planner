/**
 * Farsight
 * PBAoE Team, +To-Hit, +Defense(All), +Perception
 *
 * Source: mastermind_buff/time_manipulation/farsight.json
 */

import type { Power } from '@/types';

export const Farsight: Power = {
  "name": "Farsight",
  "internalName": "Farsight",
  "available": 23,
  "description": "You give your allies a brief glimpse of the future and what is to come. This provides you and your team a moderate increase to your chance to hit and defense for a short period of time.Recharge: Long.",
  "shortHelp": "PBAoE Team, +To-Hit, +Defense(All), +Perception",
  "icon": "timemanipulation_farsight.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 240,
    "endurance": 19.5,
    "castTime": 2.03,
    "maxTargets": 255
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
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      }
    },
    "tohitBuff": {
      "scale": 1,
      "table": "Ranged_Buff_ToHit"
    },
    "perceptionBuff": {
      "scale": 2,
      "table": "Ranged_Res_Boolean"
    }
  }
};
