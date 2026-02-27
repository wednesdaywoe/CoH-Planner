/**
 * Ring of Fire
 * Ranged, DoT (Fire), Foe Immobilize
 *
 * Source: blaster_support/fire_manipulation/ring_of_fire.json
 */

import type { Power } from '@/types';

export const RingofFire: Power = {
  "name": "Ring of Fire",
  "internalName": "Ring_of_Fire",
  "available": 0,
  "description": "Immobilizes your target in a Ring of Fire. Deals some damage over time. Useful for keeping villains at bay.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Ranged, DoT (Fire), Foe Immobilize",
  "icon": "firemanipulation_ringoffire.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 6,
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
    "Blaster Archetype Sets",
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
    "tickRate": 1.5
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
    },
    "damageBuff": {
      "scale": 0.077,
      "table": "Ranged_Ones"
    }
  }
};
