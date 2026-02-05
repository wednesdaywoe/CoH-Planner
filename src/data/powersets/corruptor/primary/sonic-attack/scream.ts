/**
 * Scream
 * Ranged, Moderate DoT(Smashing/Energy), -Res
 *
 * Source: corruptor_ranged/sonic_attack/scream.json
 */

import type { Power } from '@/types';

export const Scream: Power = {
  "name": "Scream",
  "internalName": "Scream",
  "available": 0,
  "description": "Your Scream can cause serious damage to a target.",
  "shortHelp": "Ranged, Moderate DoT(Smashing/Energy), -Res",
  "icon": "sonicblast_medium.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.47
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.132,
      "table": "Ranged_Damage",
      "duration": 1.05,
      "tickRate": 0.25
    },
    {
      "type": "Energy",
      "scale": 0.132,
      "table": "Ranged_Damage",
      "duration": 1.05,
      "tickRate": 0.25
    }
  ],
  "effects": {
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
