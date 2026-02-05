/**
 * Ring of Fire
 * Ranged, Moderate DoT(Fire), Foe Immobilize
 *
 * Source: dominator_control/fire_control/ring_of_fire.json
 */

import type { Power } from '@/types';

export const RingofFire: Power = {
  "name": "Ring of Fire",
  "internalName": "Ring_of_Fire",
  "available": 0,
  "description": "Immobilizes your target in a Ring of Fire, dealing Fire damage over time. More resilient foes may require multiple Fire Rings to Immobilize.",
  "shortHelp": "Ranged, Moderate DoT(Fire), Foe Immobilize",
  "icon": "firetrap_ringoffire.png",
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
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.22,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 4,
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
