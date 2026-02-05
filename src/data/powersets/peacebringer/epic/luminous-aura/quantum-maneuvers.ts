/**
 * Quantum Maneuvers
 * Toggle: Self +FlySpeed, Res(-Fly, Immobilize), +Def(All), +Flight Control
 *
 * Source: peacebringer/luminous-aura
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
  "targetType": "Self"
};
