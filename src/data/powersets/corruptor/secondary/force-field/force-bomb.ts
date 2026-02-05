/**
 * Force Bomb
 * Ranged (Targeted AoE), DMG(Smash), Foe Knockdown, Disorient
 *
 * Source: corruptor_buff/force_field/repulsion_bomb.json
 */

import type { Power } from '@/types';

export const ForceBomb: Power = {
  "name": "Force Bomb",
  "internalName": "Repulsion_Bomb",
  "available": 27,
  "description": "A powerful Force Bomb is hurled at your foes dealing a moderate amount of damage and knocking them off of their feet. Foes struck by Repulsion Bomb have a chance to become disoriented, and the force of the blow will leave their armor shattered, lowering their damage resistance.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Smash), Foe Knockdown, Disorient",
  "icon": "forcefield_repulsionbomb.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 12,
    "recharge": 30,
    "endurance": 16.9,
    "castTime": 1.67,
    "maxTargets": 16
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
    "Knockback",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.6,
    "table": "Ranged_Damage"
  },
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
    },
    "knockback": {
      "scale": 9,
      "table": "Ranged_Ones"
    }
  }
};
