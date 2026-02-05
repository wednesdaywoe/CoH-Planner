/**
 * Grant Cover
 * PBAoE, Team (but not self) +DEF(All but Psionic), Self +RES(Defense Debuff)
 *
 * Source: brute_defense/shield_defense/grant_cover.json
 */

import type { Power } from '@/types';

export const GrantCover: Power = {
  "name": "Grant Cover",
  "internalName": "Grant_Cover",
  "available": 23,
  "description": "You are able to use your shield to defend nearby allies. Any teammates who remain nearby gain a bonus to their defense. Additionally, while this power is active, the user will gain some resistance to defense debuffs.Notes: The defense bonus from this power is only applied to nearby team mates, but not yourself.Recharge: Moderate.",
  "shortHelp": "PBAoE, Team (but not self) +DEF(All but Psionic), Self +RES(Defense Debuff)",
  "icon": "shielddefense_grantcover.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 10,
    "endurance": 0.312,
    "castTime": 2.5,
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
    "defenseBuff": {
      "ranged": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.125,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    },
    "rechargeBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    }
  }
};
