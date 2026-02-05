/**
 * Petrifying Gaze
 * Ranged Hold
 *
 * Source: mastermind_buff/dark_miasma/petrifying_gaze.json
 */

import type { Power } from '@/types';

export const PetrifyingGaze: Power = {
  "name": "Petrifying Gaze",
  "internalName": "Petrifying_Gaze",
  "available": 23,
  "description": "Petrifies a single targeted foe with a terrifying gaze. The victim is Held and defenseless.",
  "shortHelp": "Ranged Hold",
  "icon": "darkmiasma_petrifyinggaze.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 16,
    "endurance": 9.75,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
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
