/**
 * Mass Confusion
 * Ranged (Targeted AoE), Foe Confuse
 *
 * Source: dominator_control/mind_control/mass_confusion.json
 */

import type { Power } from '@/types';

export const MassConfusion: Power = {
  "name": "Mass Confusion",
  "internalName": "Mass_Confusion",
  "available": 25,
  "description": "You can cause Mass Confusion within a group of foes, creating chaos. All affected foes within the area will turn and attack each other, ignoring all your allies. If you Confuse your foes before they noticed you, your presence will continue to go unnoticed.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "Ranged (Targeted AoE), Foe Confuse",
  "icon": "mentalcontrol_confuse.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Dominator Archetype Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 20,
      "table": "Ranged_Immobilize"
    }
  }
};
