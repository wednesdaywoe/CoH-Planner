/**
 * Frostbite
 * Ranged (Targeted AoE), DoT (Cold), Foe Immobilize, -SPD, -Recharge
 *
 * Source: controller_control/ice_control/frostbite.json
 */

import type { Power } from '@/types';

export const Frostbite: Power = {
  "name": "Frostbite",
  "internalName": "Frostbite",
  "available": 1,
  "description": "Immobilizes a group of foes in icy traps. Deals minimal Cold damage over time and slightly Slows the targets. Slower and less damaging than Chilblain, but can capture multiple targets. More resilient foes may only be Slowed.",
  "shortHelp": "Ranged (Targeted AoE), DoT (Cold), Foe Immobilize, -SPD, -Recharge",
  "icon": "iceformation_frostbite.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 15.6,
    "castTime": 2.07,
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
    "Controller Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
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
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
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
