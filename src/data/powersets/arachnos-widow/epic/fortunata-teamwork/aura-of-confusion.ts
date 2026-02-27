/**
 * Aura of Confusion
 * PBAoE, Foe Confuse
 *
 * Source: teamwork/fortunata_teamwork/aura_of_confusion.json
 */

import type { Power } from '@/types';

export const AuraofConfusion: Power = {
  "name": "Aura of Confusion",
  "available": 29,
  "description": "Aura of Confusion can cause chaos within a group of foes. All affected foes within the area will turn and attack each other, ignoring the user and their allies. If you confuse a foe before they noticed you, your presence will continue to go unnoticed. You will not receive any Experience Points for foes defeated entirely by confused enemies.",
  "shortHelp": "PBAoE, Foe Confuse",
  "icon": "fortunatateamwork_auraofconfusion.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
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
  "stats": {
    "accuracy": 1,
    "recharge": 240,
    "endurance": 26,
    "castTime": 1.67,
    "radius": 25,
    "maxTargets": 16
  },
  "targetType": "Self",
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 20,
      "table": "Ranged_Immobilize"
    }
  }
};
