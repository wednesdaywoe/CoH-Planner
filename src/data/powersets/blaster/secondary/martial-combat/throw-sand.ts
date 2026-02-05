/**
 * Throw Sand
 * Ranged (Cone), Foe Disorient, -Perception
 *
 * Source: blaster_support/martial_manipulation/throw_sand.json
 */

import type { Power } from '@/types';

export const ThrowSand: Power = {
  "name": "Throw Sand",
  "internalName": "Throw_Sand",
  "available": 27,
  "description": "You grab some nearby debris and fling it towards a nearby foe, obstructing their vision and dazing them.Recharge: Long.",
  "shortHelp": "Ranged (Cone), Foe Disorient, -Perception",
  "icon": "martialmanipulations_throwsand.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 0.8,
    "range": 40,
    "radius": 40,
    "arc": 0.7854,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Sleep"
    },
    "perceptionDebuff": {
      "scale": 0.9,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 0.029,
      "table": "Ranged_Ones"
    }
  }
};
