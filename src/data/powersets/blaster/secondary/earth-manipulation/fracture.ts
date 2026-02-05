/**
 * Fracture
 * Ranged (Targeted AoE), Foe Disorient, -DEF
 *
 * Source: blaster_support/earth_manipulation/fracture.json
 */

import type { Power } from '@/types';

export const Fracture: Power = {
  "name": "Fracture",
  "internalName": "Fracture",
  "available": 27,
  "description": "You can Fracture the ground around an enemy, disorienting all affected targets for a good while. You must be on the ground to activate this power.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Foe Disorient, -DEF",
  "icon": "earthmanip_fracture.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 20,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
