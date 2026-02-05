/**
 * Pulsar
 * PBAoE, Foe Disorient
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const Pulsar: Power = {
  "name": "Pulsar",
  "available": 17,
  "description": "Generates a brilliant pulse of Kheldian light around you that stuns nearby foes. Affected foes are Disoriented and unable to defend themselves.  Recharge: Slow.",
  "shortHelp": "PBAoE, Foe Disorient",
  "icon": "luminousblast_pulsar.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Stuns"
  ],
  "stats": {
    "accuracy": 0.8,
    "recharge": 45,
    "endurance": 15.6,
    "castTime": 3,
    "radius": 20,
    "maxTargets": 10
  },
  "targetType": "Self"
};
