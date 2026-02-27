/**
 * Personal Force Field
 * Toggle: Self +Def, Res(All except Toxic)
 *
 * Source: controller_buff/force_field/personal_force_field.json
 */

import type { Power } from '@/types';

export const PersonalForceField: Power = {
  "name": "Personal Force Field",
  "internalName": "Personal_Force_Field",
  "available": 0,
  "description": "The Personal Force Field is almost impenetrable to all attacks, even Psionics and Enemy Teleportation, although attacks from more powerful foes may get through more easily. Personal Force Field will also reduce the damage of almost any attacks that do get through. The Personal Force Field works both ways; while it is active, you can only use powers that affect yourself. Cannot be used with Rest.",
  "shortHelp": "Toggle: Self +Def, Res(All except Toxic)",
  "icon": "forcefield_personalforcefield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 15,
    "endurance": 0.13,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "onlyAffectsSelf": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "teleport": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "defenseBuff": {
      "ranged": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 7.5,
        "table": "Melee_Buff_Def"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
