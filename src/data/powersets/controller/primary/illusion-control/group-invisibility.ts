/**
 * Group Invisibility
 * PBAoE, Team Stealth, +DEF(All)
 *
 * Source: controller_control/illusion_control/group_invisibility.json
 */

import type { Power } from '@/types';

export const GroupInvisibility: Power = {
  "name": "Group Invisibility",
  "internalName": "Group_Invisibility",
  "available": 11,
  "description": "Makes you and all teammates around you Invisible. While Invisible, you and your teammates are almost impossible to detect. Even if discovered, Group Invisibility grants a bonus to your Defense to all attacks, although you will lose some of your defense bonus if you attack. Group Invisibility has no movement penalty.",
  "shortHelp": "PBAoE, Team Stealth, +DEF(All)",
  "icon": "illusions_giveinvisibility.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 240,
    "endurance": 10.4,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "stealth": {
      "stealthPvE": {
        "scale": 60,
        "table": "Ranged_Ones"
      },
      "stealthPvP": {
        "scale": 667,
        "table": "Ranged_Ones"
      },
      "translucency": {
        "scale": 0.3,
        "table": "Ranged_Ones"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      },
      "toxic": {
        "scale": 0.25,
        "table": "Ranged_Buff_Def"
      }
    },
    "threatDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
