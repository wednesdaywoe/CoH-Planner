/**
 * Indomitable Will
 * Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback).
 *
 * Source: teamwork/teamwork/indomitable_will.json
 */

import type { Power } from '@/types';

export const IndomitableWill: Power = {
  "name": "Indomitable Will",
  "internalName": "Indomitable_Will",
  "available": 9,
  "description": "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusions, Repel, Knockback and Hold effects. Indomitable Will also grants moderate resistance to Psionic based attacks.",
  "shortHelp": "Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback).",
  "icon": "teamwork_indomitablewill.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "targetType": "Self",
  "effects": {
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "fear": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "hold": {
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
    "resistance": {
      "psionic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "immobilize": {
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
    "repel": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "effectDuration": 0.75,
    "durations": {
      "confuse": 0.75,
      "fear": 0.75,
      "hold": 0.75,
      "immobilize": 0.75,
      "knockback": 0.75,
      "knockup": 0.75,
      "protection": 0.75,
      "repel": 0.75,
      "resistance": 0.75,
      "sleep": 0.75,
      "stun": 0.75
    }
  }
};
