/**
 * Chilblain
 * Ranged, DoT (Cold), Foe Immobilize, -SPD, -Recharge, -Fly
 *
 * Source: controller_control/ice_control/chilblain.json
 */

import type { Power } from '@/types';

export const Chilblain: Power = {
  "name": "Chilblain",
  "internalName": "Chilblain",
  "available": 0,
  "description": "Immobilizes your target in an icy trap, dealing some Cold damage over time as well as slightly slowing the target's attack and movement speed. It can also cause flying targets to be grounded.",
  "shortHelp": "Ranged, DoT (Cold), Foe Immobilize, -SPD, -Recharge, -Fly",
  "icon": "iceformation_chillblains.png",
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
    "Slow",
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
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.2,
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
    "mezResistance": {
      "knockup": {
        "scale": 100,
        "table": "Ranged_Ones"
      },
      "knockback": {
        "scale": 100,
        "table": "Ranged_Ones"
      }
    },
    "durations": {
      "mezResistance": 15
    },
    "buffDuration": 15
  }
};
