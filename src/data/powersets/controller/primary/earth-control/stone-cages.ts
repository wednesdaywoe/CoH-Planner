/**
 * Stone Cages
 * Ranged AoE, DMG(Smash), Foe Immobilize, -Fly, -DEF
 *
 * Source: controller_control/earth_control/stone_cages.json
 */

import type { Power } from '@/types';

export const StoneCages: Power = {
  "name": "Stone Cages",
  "internalName": "Stone_Cages",
  "available": 1,
  "description": "Immobilizes a group of foes within earthy formations and deals some Smashing damage over time. Slower and less damaging than Stone Prison, but can capture multiple targets. Stone Cages can also reduce a target's Defense.",
  "shortHelp": "Ranged AoE, DMG(Smash), Foe Immobilize, -Fly, -DEF",
  "icon": "earthgrasp_stonecages.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 15.6,
    "castTime": 1.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 5.2,
      "tickRate": 2
    },
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Ranged_InherentDamage",
      "duration": 5.2,
      "tickRate": 2
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
