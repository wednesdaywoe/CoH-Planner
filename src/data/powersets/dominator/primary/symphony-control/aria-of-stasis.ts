/**
 * Aria of Stasis
 * Ranged (Cone), DMG(Psionic), Foe Immobilize, -SPD
 *
 * Source: dominator_control/symphony_control/aria_of_stasis.json
 */

import type { Power } from '@/types';

export const AriaofStasis: Power = {
  "name": "Aria of Stasis",
  "internalName": "Aria_of_Stasis",
  "available": 1,
  "description": "Aria of Stasis roots your audience in place and causes psionic damage. Stronger foes might still be able to move, but will do so at a reduced speed.",
  "shortHelp": "Ranged (Cone), DMG(Psionic), Foe Immobilize, -SPD",
  "icon": "symphonycontrol_immobaoe.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 1.0472,
    "recharge": 8,
    "endurance": 13,
    "castTime": 1.5,
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
    "type": "Psionic",
    "scale": 0.4824,
    "table": "Ranged_Damage"
  },
  "effects": {
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
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "buffDuration": 15
  }
};
