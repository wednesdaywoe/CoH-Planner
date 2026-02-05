/**
 * Inertial Reduction
 * PBAoE, Allies +Jump
 *
 * Source: defender_buff/kinetics/inertial_reduction.json
 */

import type { Power } from '@/types';

export const InertialReduction: Power = {
  "name": "Inertial Reduction",
  "internalName": "Inertial_Reduction",
  "available": 17,
  "description": "You can reduce your Inertia, along with that of all nearby allies. The affected heroes can then jump incredible distances for a while.Recharge: Slow.",
  "shortHelp": "PBAoE, Allies +Jump",
  "icon": "kineticboost_initialreductions.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 60,
    "endurance": 23.4,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Jump"
  ],
  "allowedSetCategories": [
    "Leaping",
    "Leaping & Sprints",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 1,
        "table": "Melee_Leap"
      },
      "jumpSpeed": {
        "scale": 1,
        "table": "Melee_SpeedJumping"
      },
      "movementControl": {
        "scale": 10,
        "table": "Melee_Control"
      },
      "movementFriction": {
        "scale": 10,
        "table": "Melee_Friction"
      }
    }
  }
};
