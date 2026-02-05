/**
 * Sonic Cage
 * Ranged, Foe Capture (Special)
 *
 * Source: corruptor_buff/sonic_resonance/sonic_cage.json
 */

import type { Power } from '@/types';

export const SonicCage: Power = {
  "name": "Sonic Cage",
  "internalName": "Sonic_Cage",
  "available": 9,
  "description": "Encases the target in an impenetrable field of sonic waves. The target cannot attack or be attacked.Recharge: Slow.",
  "shortHelp": "Ranged, Foe Capture (Special)",
  "icon": "sonicdebuff_hold.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.4,
    "range": 80,
    "recharge": 60,
    "endurance": 12.48,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6,
  "effects": {
    "untouchable": {
      "scale": 4,
      "table": "Ranged_Immobilize"
    },
    "onlyAffectsSelf": {
      "scale": 4,
      "table": "Ranged_Immobilize"
    },
    "immobilize": {
      "mag": 1,
      "scale": 4,
      "table": "Ranged_Immobilize"
    },
    "effectDuration": 30
  }
};
