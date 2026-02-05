/**
 * Roots
 * Ranged (Targeted AoE), DoT(Smashing, Lethal), Foe Immobilize
 *
 * Source: dominator_control/plant_control/roots.json
 */

import type { Power } from '@/types';

export const Roots: Power = {
  "name": "Roots",
  "internalName": "Roots",
  "available": 1,
  "description": "Immobilizes a group of foes by entangling their feet in a twisted mass of thorny Roots. Roots is slower and does less damage than Entangle, but it can capture multiple foes in one attack. Like Entangle, Roots can immobilize flying targets, if they are near the ground when attacked.",
  "shortHelp": "Ranged (Targeted AoE), DoT(Smashing, Lethal), Foe Immobilize",
  "icon": "plantcontrol_roots.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 13,
    "castTime": 1.67,
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
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 5.2,
      "tickRate": 2
    },
    {
      "type": "Lethal",
      "scale": 0.1,
      "table": "Ranged_Damage",
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
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
