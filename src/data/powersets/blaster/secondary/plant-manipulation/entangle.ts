/**
 * Entangle
 * Ranged, DoT(Smash/Lethal), Foe Immobilize, -Fly
 *
 * Source: blaster_support/plant_manipulation/entangle.json
 */

import type { Power } from '@/types';

export const Entangle: Power = {
  "name": "Entangle",
  "internalName": "Entangle",
  "available": 0,
  "description": "Immobilizes your target by Entangling their feet in a twisted mass of thorny roots. The roots do smashing and lethal damage to the target over time. More resilient foes may require multiple applications to Immobilize. Entangle can immobilize flying targets, if they are near the ground when attacked.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Ranged, DoT(Smash/Lethal), Foe Immobilize, -Fly",
  "icon": "plantmanipulation_entangle.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.2
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
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 9.2,
      "tickRate": 2
    },
    {
      "type": "Lethal",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 9.2,
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
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
