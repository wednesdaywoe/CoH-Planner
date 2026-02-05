/**
 * Wet Ice
 * Self, +DEF(All), +Res(Cold, Disorient, Immobilize, Hold, Sleep, Slow, Knockback, DeBuff DEF)
 *
 * Source: sentinel_defense/ice_armor/wet_ice.json
 */

import type { Power } from '@/types';

export const WetIce: Power = {
  "name": "Wet Ice",
  "internalName": "Wet_Ice",
  "available": 3,
  "description": "When you activate this power, you cover yourself in a thick coating of slick, melting ice. This makes you slippery, leaving you nearly immune to Disorient, Immobilization, Hold, Sleep, Slow and Knockback effects. This power also adds a slight increase to your defense to all attacks. Wet Ice also reduces Cold damage and grants you resistance to Defense DeBuffs.",
  "shortHelp": "Self, +DEF(All), +Res(Cold, Disorient, Immobilize, Hold, Sleep, Slow, Knockback, DeBuff DEF)",
  "icon": "icearmor_wetice.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
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
    "movement": {
      "runSpeed": {
        "scale": 0.6,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.6,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.6,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 0.6,
        "table": "Melee_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "resistance": {
      "cold": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    },
    "defenseBuff": {
      "smashing": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.1,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
