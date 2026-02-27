/**
 * Wild Growth
 * PBAoE, Team +Res(All), +Regen, +2 Bloom
 *
 * Source: controller_buff/nature_affinity/wild_growth.json
 */

import type { Power } from '@/types';

export const WildGrowth: Power = {
  "name": "Wild Growth",
  "internalName": "Wild_Growth",
  "available": 3,
  "description": "You channel the power of nature into your allies allowing them to more easily shrug off damage and causing their wounds to heal more quickly. Wild Growth increases the damage resistance and boosts the regeneration rate of all affected allies. This power also grants 2 stacks of Bloom.Recharge: Long.",
  "shortHelp": "PBAoE, Team +Res(All), +Regen, +2 Bloom",
  "icon": "natureaffinity_wildgrowth.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 225,
    "endurance": 15.6,
    "castTime": 2.17,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      }
    },
    "regenBuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
