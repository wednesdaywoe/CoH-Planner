/**
 * Crush
 * Ranged, DoT(Smash), Foe Immobilize, -Fly
 *
 * Source: dominator_control/gravity_control/crush.json
 */

import type { Power } from '@/types';

export const Crush: Power = {
  "name": "Crush",
  "internalName": "Crush",
  "available": 0,
  "description": "Creates a localized gravitational field strong enough to Immobilize a single foe. Crush can also bring down flying entities. This power deals Smashing damage over time and can Slow the movement of targets that escape its grasp.",
  "shortHelp": "Ranged, DoT(Smash), Foe Immobilize, -Fly",
  "icon": "gravitycontrol_crush.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.33
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
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
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
    "movement": {
      "jumpHeight": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
