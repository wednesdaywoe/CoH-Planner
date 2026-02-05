/**
 * Detention Field
 * Ranged, Foe Capture (Special)
 *
 * Source: mastermind_buff/force_field/detention_field.json
 */

import type { Power } from '@/types';

export const DetentionField: Power = {
  "name": "Detention Field",
  "internalName": "Detention_Field",
  "available": 9,
  "description": "Encases a targeted foe in a Detention Force Field. The captured target cannot be harmed, is Immobilized, and cannot attack or aid their allies. The target can, however, use powers on themselves.",
  "shortHelp": "Ranged, Foe Capture (Special)",
  "icon": "forcefield_refractionshield.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 60,
    "endurance": 13,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6,
  "effects": {
    "immobilize": {
      "mag": 1,
      "scale": 4,
      "table": "Ranged_Immobilize"
    },
    "effectDuration": 30,
    "untouchable": {
      "scale": 4,
      "table": "Ranged_Immobilize"
    },
    "onlyAffectsSelf": {
      "scale": 4,
      "table": "Ranged_Immobilize"
    }
  }
};
