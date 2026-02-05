/**
 * Total Domination
 * Ranged (Targeted AoE), Foe Hold
 *
 * Source: dominator_control/mind_control/total_domination.json
 */

import type { Power } from '@/types';

export const TotalDomination: Power = {
  "name": "Total Domination",
  "internalName": "Total_Domination",
  "available": 17,
  "description": "Tears at the mind of a target foe and those near him. Total Domination renders all affected foes helpless, lost in their own minds and unable to defend themselves.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "Ranged (Targeted AoE), Foe Hold",
  "icon": "mentalcontrol_freeze.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "radius": 20,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    }
  }
};
