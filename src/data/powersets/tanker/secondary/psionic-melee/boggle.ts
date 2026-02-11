/**
 * Boggle
 * Short Ranged, Target Confuse, +Special
 *
 * Source: tanker_melee/psionic_melee/boggle.json
 */

import type { Power } from '@/types';

export const Boggle: Power = {
  "name": "Boggle",
  "internalName": "Boggle",
  "available": 23,
  "description": "You flood your foe's mind with doubt causing them to become confused for a brief time. Confused foes will attack their allies. Boggle will also place the \"Boggled\" effect on your target for a short time. Attacking a Boggled target will increase your chance of gaining Insight.Notes: Boggle is unaffected by Range changes.",
  "shortHelp": "Short Ranged, Target Confuse, +Special",
  "icon": "psionicmelee_boggle.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 20,
    "endurance": 7.8,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 15,
      "table": "Melee_Ones"
    }
  }
};
