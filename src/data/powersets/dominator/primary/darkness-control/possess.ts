/**
 * Possess
 * Ranged, Target Confuse
 *
 * Source: dominator_control/darkness_control/possess.json
 */

import type { Power } from '@/types';

export const Possess: Power = {
  "name": "Possess",
  "internalName": "Possess",
  "available": 5,
  "description": "You cause your targeted foe to be possessed by a dark entity from the Netherworld causing them to be confused for a short period of time. While confused they will be unable to tell the difference between friend or foe and will attack nearby allies.Recharge: Moderate.",
  "shortHelp": "Ranged, Target Confuse",
  "icon": "darknesscontrol_possess.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.33
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
