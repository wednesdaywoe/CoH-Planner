/**
 * Howl
 * Ranged Cone, Minor DMG(Smashing/Energy), Foe -Res(All)
 *
 * Source: corruptor_ranged/sonic_attack/howl.json
 */

import type { Power } from '@/types';

export const Howl: Power = {
  "name": "Howl",
  "internalName": "Howl",
  "available": 1,
  "description": "A short ranged sonic attack that can hit multiple enemies in an arc in front of you.",
  "shortHelp": "Ranged Cone, Minor DMG(Smashing/Energy), Foe -Res(All)",
  "icon": "sonicblast_cone.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 50,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.6,
    "maxTargets": 10
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
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.3347,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.3347,
      "table": "Ranged_Damage"
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
