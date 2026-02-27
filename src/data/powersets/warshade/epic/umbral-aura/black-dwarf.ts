/**
 * Black Dwarf
 * Toggle: Shapeshift, Special
 *
 * Source: warshade_defensive/umbral_aura/black_dwarf.json
 */

import type { Power } from '@/types';

export const BlackDwarf: Power = {
  "name": "Black Dwarf",
  "available": 19,
  "description": "Kheldians are masters of energy and matter. A Warshade can transform into a massive unstoppable essence draining beast known as a Black Dwarf. When you choose this power, you will have access to 6 other powers that can only be used while in this form. You will not be able to use any other powers while in Black Dwarf form. Black Dwarf has awesome resistance to all damage except Psionics, as well as controlling effects. Black Dwarf also has improved HP and Endurance Recovery, but is limited to melee attacks.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Shapeshift, Special",
  "icon": "umbralaura_blackdwarf.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Jump"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Leaping",
    "Leaping & Sprints",
    "Resist Damage",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 1,
    "endurance": 0.13
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "fear": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "hold": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
      "mag": 1,
      "scale": 60,
      "table": "Melee_Res_Boolean"
    },
    "maxHPBuff": {
      "scale": 7.5,
      "table": "Melee_HealSelf"
    },
    "recoveryBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "movement": {
      "jumpHeight": {
        "scale": 2,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.01,
        "table": "Melee_Ones"
      },
      "movementControl": {
        "scale": 10,
        "table": "Melee_Control"
      },
      "movementFriction": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "knockup": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "effectDuration": 2.03
  }
};
