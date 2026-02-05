/**
 * Rooted
 * Toggle: Self +Res(Knockback, Sleep, Disorient, Hold, End Drain, DeBuff DEF), +Regeneration
 *
 * Source: tanker_defense/stone_armor/rooted.json
 */

import type { Power } from '@/types';

export const Rooted: Power = {
  "name": "Rooted",
  "internalName": "Rooted",
  "available": 7,
  "description": "While this power is active, you merge with the Earth and draw forth its power to become resistant to Knockback, Sleep, Hold, Disorient and Endurance Drain effects, and increase your Hit Point Regeneration rate. Rooted also grants you resistance to Defense DeBuffs.Recharge: Fast.",
  "shortHelp": "Toggle: Self +Res(Knockback, Sleep, Disorient, Hold, End Drain, DeBuff DEF), +Regeneration",
  "icon": "stonearmor_rooted.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceGain": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    },
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 10,
      "table": "Melee_Ones"
    },
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
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "movement": {
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Melee_Ones"
      }
    },
    "slow": {
      "runSpeed": {
        "scale": 0.9,
        "table": "Melee_Ones"
      },
      "fly": {
        "scale": 10,
        "table": "Melee_Ones"
      }
    }
  }
};
