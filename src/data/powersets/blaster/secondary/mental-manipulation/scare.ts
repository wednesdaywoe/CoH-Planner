/**
 * Scare
 * Ranged, Foe Fear
 *
 * Source: blaster_support/mental_manipulation/scare.json
 */

import type { Power } from '@/types';

export const Scare: Power = {
  "name": "Scare",
  "internalName": "Scare",
  "available": 23,
  "description": "You entwine a single foe within their deepest fears and cause them to helplessly tremble for a brief while.Recharge: Slow.",
  "shortHelp": "Ranged, Foe Fear",
  "icon": "mentalcontrol_scare.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 20,
    "endurance": 10.4,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Fear"
  ],
  "maxSlots": 6,
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Fear"
    },
    "damageBuff": {
      "scale": 0.176,
      "table": "Melee_Ones"
    }
  }
};
