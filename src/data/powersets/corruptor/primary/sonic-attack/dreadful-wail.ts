/**
 * Dreadful Wail
 * PBAoE, Extreme DMG(Energy/Smash), Foe Disorient, -Res(All)
 *
 * Source: corruptor_ranged/sonic_attack/dreadful_wail.json
 */

import type { Power } from '@/types';

export const DreadfulWail: Power = {
  "name": "Dreadful Wail",
  "internalName": "Dreadful_Wail",
  "available": 25,
  "description": "Your Dreadful Wail is so strong that most foes will be defeated by being subjected to it. Dreadful Wail deals Extreme Smashing and Energy damage to all nearby foes in addition to disorienting them for a good while.",
  "shortHelp": "PBAoE, Extreme DMG(Energy/Smash), Foe Disorient, -Res(All)",
  "icon": "sonicblast_massivedamage.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 25,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 1.97,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 2,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 2,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
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
