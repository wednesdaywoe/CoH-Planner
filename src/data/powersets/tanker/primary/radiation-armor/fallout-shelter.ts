/**
 * Fallout Shelter
 * Toggle: Self +Res(Hold, Sleep, Immobilize, Stun, Knockdown, Toxic, Psi, Slow)
 *
 * Source: tanker_defense/radiation_armor/fallout_shelter.json
 */

import type { Power } from '@/types';

export const FalloutShelter: Power = {
  "name": "Fallout Shelter",
  "internalName": "Fallout_Shelter",
  "available": 5,
  "description": "While active you are protected from recharge, movement, hold, sleep, immobilize, stun and knockdown effects. Additionally Fallout Shelter grants you minor resistance to toxic and psionic damage as well as a measure of resistance against slow effects.",
  "shortHelp": "Toggle: Self +Res(Hold, Sleep, Immobilize, Stun, Knockdown, Toxic, Psi, Slow)",
  "icon": "radiationarmor_falloutshelter.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "resistance": {
      "fire": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 1.05,
        "table": "Melee_Res_Boolean"
      },
      "flySpeed": {
        "scale": 1.05,
        "table": "Melee_Res_Boolean"
      },
      "jumpSpeed": {
        "scale": 1.05,
        "table": "Melee_Res_Boolean"
      },
      "jumpHeight": {
        "scale": 1.05,
        "table": "Melee_Res_Boolean"
      }
    },
    "rechargeBuff": {
      "scale": 1.05,
      "table": "Melee_Res_Boolean"
    }
  }
};
