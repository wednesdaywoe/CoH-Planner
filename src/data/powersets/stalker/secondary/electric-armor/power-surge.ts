/**
 * Power Surge
 * Self +Res(All DMG, but Psionics), +Res(Knockback, Repel, Disorient, Hold, Immobilize, Sleep), +Regen, +Recovery, +Special
 *
 * Source: stalker_defense/electric_armor/power_surge.json
 */

import type { Power } from '@/types';

export const PowerSurge: Power = {
  "name": "Power Surge",
  "internalName": "Power_Surge",
  "available": 29,
  "description": "When you activate this power, you transform your body into living Electricity and become extremely resistant to all damage but Psionics, as well as Disorient, Sleep, Hold, Immobilize, Knockback, End Drain, Recovery DeBuff, and enemy Teleportation. Your Regeneration rate and Endurance recovery are also increased. As Power Surge wears off, the charge in your body explodes in a massive EMP pulse.",
  "shortHelp": "Self +Res(All DMG, but Psionics), +Res(Knockback, Repel, Disorient, Hold, Immobilize, Sleep), +Regen, +Recovery, +Special",
  "icon": "electricarmor_selfbuffdefense.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 350,
    "endurance": 2.6,
    "castTime": 1.96
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Holds",
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
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "recoveryBuff": {
      "scale": 4,
      "table": "Melee_Res_Boolean"
    },
    "regenBuff": {
      "scale": 4,
      "table": "Melee_Ones"
    },
    "knockup": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 4,
      "table": "Melee_Res_Boolean"
    },
    "hold": {
      "mag": 1,
      "scale": 50,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
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
    "effectDuration": 30
  }
};
