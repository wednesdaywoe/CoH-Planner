/**
 * Detention Field
 * Ranged, Foe Capture (Special)
 *
 * Source: defender_buff/force_field/refraction_shield.json
 */

import type { Power } from '@/types';

export const DetentionField: Power = {
  "name": "Detention Field",
  "internalName": "Refraction_Shield",
  "available": 7,
  "description": "Encases a targeted foe in a Detention Force Field. The captured target cannot be harmed, is Immobilized, and cannot attack or aid their allies. The target can, however, use powers on themselves.",
  "shortHelp": "Ranged, Foe Capture (Special)",
  "icon": "forcefield_refractionshield.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.4,
    "range": 80,
    "recharge": 60,
    "endurance": 10.4,
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
