/**
 * Total Domination
 * Ranged (Targeted AoE), Foe Hold
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const TotalDomination: Power = {
  "name": "Total Domination",
  "available": 25,
  "description": "Tears at the mind of a target foe and those near him. Total Domination renders all affected foes helpless, lost in their own minds and unable to defend themselves.",
  "shortHelp": "Ranged (Targeted AoE), Foe Hold",
  "icon": "fortunatatraining_totaldomination.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Soldiers of Arachnos Archetype Sets"
  ],
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "recharge": 240,
    "endurance": 15.6,
    "castTime": 2.03,
    "radius": 20,
    "maxTargets": 12
  },
  "targetType": "Foe (Alive)"
};
