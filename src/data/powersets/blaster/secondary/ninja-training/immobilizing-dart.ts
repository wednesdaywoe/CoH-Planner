/**
 * Immobilizing Dart
 * Ranged, Minor DoT(Toxic), Foe Immobilize
 *
 * Source: blaster_support/ninja_training/immobilizing_dart.json
 */

import type { Power } from '@/types';

export const ImmobilizingDart: Power = {
  "name": "Immobilizing Dart",
  "internalName": "Immobilizing_Dart",
  "available": 0,
  "description": "Immobilizing Darts do minor toxic damage over time and weakens your foe's legs. They will either be entirely unable to move, or severely slowed down.Damage: Minor.Recharge: Fast.",
  "shortHelp": "Ranged, Minor DoT(Toxic), Foe Immobilize",
  "icon": "ninjatools_immob.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.5
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
  "damage": {
    "type": "Toxic",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 3.1,
    "tickRate": 1
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
