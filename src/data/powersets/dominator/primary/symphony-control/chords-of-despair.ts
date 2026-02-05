/**
 * Chords of Despair
 * Ranged (Targeted AoE), Foe Hold
 *
 * Source: dominator_control/symphony_control/chords_of_despair.json
 */

import type { Power } from '@/types';

export const ChordsofDespair: Power = {
  "name": "Chords of Despair",
  "internalName": "Chords_of_Despair",
  "available": 21,
  "description": "Your audience falls into deep despair, incapacitating them.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "Ranged (Targeted AoE), Foe Hold",
  "icon": "symphonycontrol_holdaoe.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "radius": 20,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.67,
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
