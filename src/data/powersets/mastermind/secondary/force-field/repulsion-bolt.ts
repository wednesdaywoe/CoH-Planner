/**
 * Repulsion Bolt
 * Ranged, DMG(Smash), Foe Knockback
 *
 * Source: mastermind_buff/force_field/force_bolt.json
 */

import type { Power } from '@/types';

export const RepulsionBolt: Power = {
  "name": "Repulsion Bolt",
  "internalName": "Force_Bolt",
  "available": 0,
  "description": "Discharges a bolt of force that knocks down foes and deals some Smashing Damage. Foes struck will have their armor shattered by the force of the impact, leaving them with lowered damage resistance.",
  "shortHelp": "Ranged, DMG(Smash), Foe Knockback",
  "icon": "forcefield_forcebolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 12.74,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets",
    "Mastermind Archetype Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.2,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 9,
      "table": "Ranged_Knockback"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Debuff_Res_Dmg"
      }
    }
  }
};
