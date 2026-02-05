/**
 * Screech
 * Ranged, High DMG(Smashing/Energy), Foe Disorient, -Res(All)
 *
 * Source: corruptor_ranged/sonic_attack/screech.json
 */

import type { Power } from '@/types';

export const Screech: Power = {
  "name": "Screech",
  "internalName": "Screech",
  "available": 21,
  "description": "By bursting forth with this hypersonic Screech, you can inflict high damage and disorient a target.",
  "shortHelp": "Ranged, High DMG(Smashing/Energy), Foe Disorient, -Res(All)",
  "icon": "sonicblast_stun.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.14,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.14,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Ranged_Stun"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      }
    }
  }
};
