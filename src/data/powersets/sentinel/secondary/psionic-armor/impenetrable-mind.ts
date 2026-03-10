/**
 * Impenetrable Mind
 * Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Knockback)
 *
 * Source: sentinel_defense/psionic_armor/impenetrable_mind.json
 */

import type { Power } from '@/types';

export const ImpenetrableMind: Power = {
  "name": "Impenetrable Mind",
  "internalName": "Impenetrable_Mind",
  "available": 9,
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
    "effectDuration": 0.75,
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
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "knockback": {
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "protection": {
      "knockup": 1,
      "knockback": 1
    },
    "durations": {
      "confuse": 0.75,
      "fear": 0.75,
      "hold": 0.75,
      "immobilize": 0.75,
      "knockback": 0.75,
      "knockup": 0.75,
      "protection": 0.75,
      "resistance": 0.75,
      "sleep": 0.75,
      "stun": 0.75
    }
  }
};
