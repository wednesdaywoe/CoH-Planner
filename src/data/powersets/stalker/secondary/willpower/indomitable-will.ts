/**
 * Indomitable Will
 * Toggle: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback). DEF(Psionics)
 *
 * Source: stalker_defense/willpower/indomitable_will.json
 */

import type { Power } from '@/types';

export const IndomitableWill: Power = {
  "name": "Indomitable Will",
  "internalName": "Indomitable_Will",
  "available": 15,
  "description": "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusions, Repel, Knockback and Hold effects. Indomitable Will also grants a moderate defense to Psionic based attacks.Recharge: Fast.",
  "shortHelp": "Toggle: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback). DEF(Psionics)",
  "icon": "willpower_indomitablewill.png",
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
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
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
    "defenseBuff": {
      "psionic": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
