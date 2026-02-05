/**
 * Thunder Clap
 * PBAoE, Foe Disorient
 *
 * Source: controller_buff/storm_summoning/thunder_clap.json
 */

import type { Power } from '@/types';

export const ThunderClap: Power = {
  "name": "Thunder Clap",
  "internalName": "Thunder_Clap",
  "available": 23,
  "description": "You can call forth a tremendous Thunder Clap that will Disorient most foes in a large area around you.Recharge: Slow.",
  "shortHelp": "PBAoE, Foe Disorient",
  "icon": "stormsummoning_thunderclap.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 25,
    "recharge": 45,
    "endurance": 10.4,
    "castTime": 2.37,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 10,
      "table": "Ranged_Stun"
    }
  }
};
