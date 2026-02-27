/**
 * Light Form
 * Self, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, Repel, All DMG but Psionics)
 *
 * Source: peacebringer_defensive/luminous_aura/light_form.json
 */

import type { Power } from '@/types';

export const LightForm: Power = {
  "name": "Light Form",
  "available": 31,
  "description": "When you activate Light Form, you become pure Kheldian energy and are extremely resistant to most damage. You are also partially protected from some Disorient, Immobilization, Hold, Sleep, Knockback and Repel effects. Endurance recovery is also increased. Light Form costs little Endurance to activate, but when it wears off you are left exhausted, and drained of Hit Points and Endurance.  Recharge: Very Long.",
  "shortHelp": "Self, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, Repel, All DMG but Psionics)",
  "icon": "luminousaura_lightform.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "endurance": 2.6,
    "castTime": 1.67
  },
  "targetType": "Self",
  "damage": [
    {
      "type": "Special",
      "scale": -0.5,
      "table": "Melee_Ones"
    },
    {
      "type": "Special",
      "scale": 1,
      "table": "Melee_Ones"
    }
  ],
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 7,
        "table": "Melee_Res_Dmg"
      }
    },
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "knockup": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 10,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
      "mag": 1,
      "scale": 10,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 10,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 10,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 90
  }
};
