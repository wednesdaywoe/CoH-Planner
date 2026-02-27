/**
 * Strength of Will
 * Self, +Res(Disorient, Sleep, Hold, Immobilize, Repel, Knockback, All DMG), +Recovery
 *
 * Source: stalker_defense/willpower/strength_of_will.json
 */

import type { Power } from '@/types';

export const StrengthofWill: Power = {
  "name": "Strength of Will",
  "internalName": "Strength_of_Will",
  "available": 29,
  "description": "When you activate this power, you not only become extremely resistant to most damage, but also to Disorient, Immobilization, Hold, Knockback, Repel and Sleep effects. Strength of Will costs little Endurance to activate and increases your recovery for its duration, but when it wears off you are left exhausted, and substantially drained of Endurance.Notes: Strength of Will is unaffected by Recharge Time changes.Recharge: Very Long.",
  "shortHelp": "Self, +Res(Disorient, Sleep, Hold, Immobilize, Repel, Knockback, All DMG), +Recovery",
  "icon": "willpower_strengthofwill.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "endurance": 2.6,
    "castTime": 3.1
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
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
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 120,
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
    "hold": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    }
  }
};
