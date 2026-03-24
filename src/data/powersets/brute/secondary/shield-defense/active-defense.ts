/**
 * Active Defense
 * Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback, Defense Debuff)
 *
 * Source: brute_defense/shield_defense/battle_agility.json
 */

import type { Power } from '@/types';

export const ActiveDefense: Power = {
  "name": "Active Defense",
  "internalName": "Battle_Agility",
  "available": 9,
  "description": "When you activate this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusion, Repel, Knockback, Hold and Defense Debuff effects for a short duration.Recharge: Long.",
  "shortHelp": "Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback, Defense Debuff)",
  "icon": "shielddefense_battleagility.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 200,
    "endurance": 10.4,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 120,
    "durations": {
      "confuse": 120,
      "fear": 120,
      "hold": 120,
      "stun": 120,
      "sleep": 120,
      "immobilize": 120,
      "knockup": 120,
      "knockback": 120,
      "repel": 120,
      "elusivity": 120
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
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "knockup": {
      "scale": 110,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 110,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 110,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    },
    "buffDuration": 120
  }
};
