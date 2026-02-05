/**
 * Fire Cages
 * Ranged (Targeted AoE), Minor DoT(Fire), Foe Immobilize
 *
 * Source: dominator_control/fire_control/fire_cages.json
 */

import type { Power } from '@/types';

export const FireCages: Power = {
  "name": "Fire Cages",
  "internalName": "Fire_Cages",
  "available": 1,
  "description": "Immobilizes a group of foes in Fire Cages, dealing Fire damage over time. More resilient foes may require multiple Fire Cages to Immobilize. Fire Cages is slower and less damaging than Ring of Fire, but can capture multiple targets.",
  "shortHelp": "Ranged (Targeted AoE), Minor DoT(Fire), Foe Immobilize",
  "icon": "firetrap_firecage.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 15.6,
    "castTime": 1.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.11,
    "table": "Ranged_Damage",
    "duration": 5.2,
    "tickRate": 2
  },
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
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
