/**
 * Impenetrable Mind
 * Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Knockback)
 *
 * Source: tanker_defense/psionic_armor/impenetrable_mind.json
 */

import type { Power } from '@/types';

export const ImpenetrableMind: Power = {
  "name": "Impenetrable Mind",
  "internalName": "Impenetrable_Mind",
  "available": 1,
  "description": "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusion, Knockback and Hold effects. Impenetrable Mind also grants moderate resistance to Psionic based attacks.",
  "shortHelp": "Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Knockback)",
  "icon": "psionicarmor_impenetrablemind.png",
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
    "resistance": {
      "psionic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
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
      "scale": 1,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "effectDuration": 0.75
  }
};
