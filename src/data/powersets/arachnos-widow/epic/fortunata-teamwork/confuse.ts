/**
 * Confuse
 * Ranged, Target Confuse
 *
 * Source: teamwork/fortunata_teamwork/confuse.json
 */

import type { Power } from '@/types';

export const Confuse: Power = {
  "name": "Confuse",
  "available": 23,
  "description": "You can Confuse an enemy, forcing him to believe his friends are not who they appear to be. If successful, the enemy will ignore you and attack his own allies. If you Confuse someone before he has noticed you, your presence will continue to be masked. You will not receive any Experience Points for foes defeated entirely by a Confused enemy.",
  "shortHelp": "Ranged, Target Confuse",
  "icon": "fortunatateamwork_confuse.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2
  },
  "targetType": "Foe (Alive)",
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 20,
      "table": "Ranged_Immobilize"
    }
  }
};
