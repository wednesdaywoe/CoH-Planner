/**
 * Melodic Binding
 * Ranged, DMG(Psionic), Foe Immobilize, -SPD
 *
 * Source: controller_control/symphony_control/melodic_binding.json
 */

import type { Power } from '@/types';

export const MelodicBinding: Power = {
  "name": "Melodic Binding",
  "internalName": "Melodic_Binding",
  "available": 0,
  "description": "Melodic Binding immobilizes your target in place and inflict psionic damage. Stronger foes might still be able to move, but will do so at a reduced speed.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Immobilize, -SPD",
  "icon": "symphonycontrol_immobst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.5
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
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "movement": {
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
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "immobilize": {
      "mag": 4,
      "scale": 15,
      "table": "Ranged_Immobilize"
    }
  }
};
