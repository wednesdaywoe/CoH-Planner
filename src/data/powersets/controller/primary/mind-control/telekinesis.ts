/**
 * Telekinesis
 * Toggle: Ranged (Targeted AoE), Foe Immobilize, Repel
 *
 * Source: controller_control/mind_control/telekinesis.json
 */

import type { Power } from '@/types';

export const Telekinesis: Power = {
  "name": "Telekinesis",
  "internalName": "Telekinesis",
  "available": 11,
  "description": "Lifts a foe, and any nearby foes, off the ground and repels them. The targets are helpless, unable to move, and will continue to hover away, picking up any passing targets, as long as you keep this power active. Keeping up this level of concentration costs a lot of Endurance. Note despite this power being auto-hit, it still requires a ToHit check.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Foe Immobilize, Repel",
  "icon": "mentalcontrol_telekinesis.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 20,
    "recharge": 90,
    "endurance": 0.26,
    "castTime": 1.13,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Immobilize"
  ],
  "maxSlots": 6,
  "effects": {
    "immobilize": {
      "mag": 4,
      "scale": 5,
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
    "repel": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "movement": {
      "fly": {
        "scale": 1,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 1.1788,
        "table": "Melee_SpeedFlying"
      }
    }
  }
};
