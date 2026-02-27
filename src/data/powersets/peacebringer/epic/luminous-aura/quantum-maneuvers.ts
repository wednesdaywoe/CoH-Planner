/**
 * Quantum Maneuvers
 * Toggle: Self +FlySpeed, Res(-Fly, Immobilize), +Def(All), +Flight Control
 *
 * Source: peacebringer_defensive/luminous_aura/quantum_acceleration.json
 */

import type { Power } from '@/types';

export const QuantumManeuvers: Power = {
  "name": "Quantum Maneuvers",
  "available": 25,
  "description": "While Energy Flight, Combat Flight or Group Energy Flight are active, Quantum Maneuvers increases fly speed and movement control. It will also grant resistance against knockback and protection against -Fly and Immobilization.  Quantum Maneuvers' flight speed buff stacks with other flight powers, and isn't suppressed by combat.  Notes: Quantum Maneuvers provides a moderate amount of Defense even while on the ground, but this defense is lost if you attack, buff allies, give an order to pets or interact with a mission objective.  Recharge: Moderate.",
  "shortHelp": "Toggle: Self +FlySpeed, Res(-Fly, Immobilize), +Def(All), +Flight Control",
  "icon": "luminousaura_lightofreason.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Fly",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Flight",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.052
  },
  "targetType": "Self",
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Melee_Buff_Def"
      }
    },
    "movement": {
      "fly": {
        "scale": 2,
        "table": "Melee_Ones"
      },
      "movementControl": {
        "scale": 15,
        "table": "Melee_Control"
      },
      "movementFriction": {
        "scale": 15,
        "table": "Melee_Friction"
      },
      "flySpeed": {
        "scale": 0.4,
        "table": "Melee_SpeedFlying"
      }
    },
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "knockup": {
      "scale": 1.75,
      "table": "Melee_Res_Boolean"
    },
    "knockback": {
      "scale": 1.75,
      "table": "Melee_Res_Boolean"
    }
  }
};
