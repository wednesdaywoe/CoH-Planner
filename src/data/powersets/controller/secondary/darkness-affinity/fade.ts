/**
 * Fade
 * PBAoE Ally, +Defense(All), +Res(Defense Debuffs, Lethal, Smash, Negative, Psionic)
 *
 * Source: controller_buff/darkness_affinity/fade.json
 */

import type { Power } from '@/types';

export const Fade: Power = {
  "name": "Fade",
  "internalName": "Fade",
  "available": 19,
  "description": "You partially bring yourself and all nearby allies into the Netherworld vastly increasing their Defense to all attacks and resistance to lethal, smashing, negative energy and psionic damage for a very short period of time as well as dramatically increasing their resistance to Defense Debuffs. This power is best used to help counter a dangerous situation.",
  "shortHelp": "PBAoE Ally, +Defense(All), +Res(Defense Debuffs, Lethal, Smash, Negative, Psionic)",
  "icon": "darknessaffinity_fade.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 40,
    "recharge": 210,
    "endurance": 7.8,
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
      },
      "toxic": {
        "scale": 1.25,
        "table": "Ranged_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 1,
        "table": "Ranged_Res_Boolean"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
