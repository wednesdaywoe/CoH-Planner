/**
 * Fortify Pack
 * PBAoE, Pets +Defense, +Regeneration, consumes all charges of Pack Mentality
 *
 * Source: mastermind_summon/beast_mastery/fortify_pack.json
 */

import type { Power } from '@/types';

export const FortifyPack: Power = {
  "name": "Fortify Pack",
  "internalName": "Fortify_Pack",
  "available": 17,
  "description": "You command your beasts to fight more defensively. The number of charges of Pack Mentality you own when activating this power will determine the potency of the Defense and Regeneration buff that will be granted to your pack.",
  "shortHelp": "PBAoE, Pets +Defense, +Regeneration, consumes all charges of Pack Mentality",
  "icon": "beastmastery_fortifypack.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 30,
    "recharge": 240,
    "endurance": 16.25,
    "castTime": 2.27,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      },
      "toxic": {
        "scale": 0,
        "table": "Ranged_Buff_Def"
      }
    },
    "regenBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
