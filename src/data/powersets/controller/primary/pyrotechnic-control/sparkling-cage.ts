/**
 * Sparkling Cage
 * Ranged, Moderate DoT(Fire, Energy), Foe Immobilize, Chance for Blast Off
 *
 * Source: controller_control/pyrotechnic_control/sparkling_cage.json
 */

import type { Power } from '@/types';

export const SparklingCage: Power = {
  "name": "Sparkling Cage",
  "internalName": "Sparkling_Cage",
  "available": 0,
  "description": "Immobilizes your target in a ring of pyrotechnic energy, dealing Fire and Energy damage over time. More resilient foes may require multiple Sparkling Cages to Immobilize.This power has a chance of Blasting Off targets into the air.",
  "shortHelp": "Ranged, Moderate DoT(Fire, Energy), Foe Immobilize, Chance for Blast Off",
  "icon": "pyrotechnic_sparklingcage.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.17
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.11,
      "table": "Ranged_Damage",
      "duration": 9.2,
      "tickRate": 2
    },
    {
      "type": "Energy",
      "scale": 0.11,
      "table": "Ranged_Damage",
      "duration": 9.2,
      "tickRate": 2
    },
    {
      "type": "Energy",
      "scale": 0.11,
      "table": "Ranged_InherentDamage",
      "duration": 9.2,
      "tickRate": 2
    },
    {
      "type": "Fire",
      "scale": 0.11,
      "table": "Ranged_InherentDamage",
      "duration": 9.2,
      "tickRate": 2
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 4,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
