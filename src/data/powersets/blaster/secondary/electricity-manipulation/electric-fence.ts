/**
 * Electric Fence
 * Ranged, DoT (Energy), Foe Immobilize, -End
 *
 * Source: blaster_support/electricity_manipulation/electric_fence.json
 */

import type { Power } from '@/types';

export const ElectricFence: Power = {
  "name": "Electric Fence",
  "internalName": "Electric_Fence",
  "available": 0,
  "description": "Surrounds and Immobilizes a single target in an Electric Fence. Deals some damage over time and slowly drains some Endurance. Useful for keeping villains at bay.",
  "shortHelp": "Ranged, DoT (Energy), Foe Immobilize, -End",
  "icon": "electricitymanipulation_electricfence.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
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
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 8.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.028,
      "table": "Ranged_Ones"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 0.077,
      "table": "Ranged_Ones"
    }
  }
};
