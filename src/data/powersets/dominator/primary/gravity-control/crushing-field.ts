/**
 * Crushing Field
 * Ranged (Targeted AoE), DoT(Smash), Foe Immobilize, -Fly
 *
 * Source: dominator_control/gravity_control/crushing_field.json
 */

import type { Power } from '@/types';

export const CrushingField: Power = {
  "name": "Crushing Field",
  "internalName": "Crushing_Field",
  "available": 7,
  "description": "Creates a large gravitational field strong enough to Immobilize multiple foes. Crushing Field can also bring down flying entities. Slower and less damaging than Crush, but can capture multiple targets. Crushing Field deals Smashing damage over time and can Slow the movement of targets that escape its grasp.",
  "shortHelp": "Ranged (Targeted AoE), DoT(Smash), Foe Immobilize, -Fly",
  "icon": "gravitycontrol_crushingfield.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 15.6,
    "castTime": 1.33,
    "maxTargets": 16
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
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.1,
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
