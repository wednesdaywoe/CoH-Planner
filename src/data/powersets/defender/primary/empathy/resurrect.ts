/**
 * Resurrect
 * Ally Rez
 *
 * Source: defender_buff/empathy/resurrect.json
 */

import type { Power } from '@/types';

export const Resurrect: Power = {
  "name": "Resurrect",
  "internalName": "Resurrect",
  "available": 5,
  "description": "Resurrects a fallen ally with full Hit Points and Endurance. The Resurrected target is left protected from XP Debt for 90 seconds.Recharge: Long.",
  "shortHelp": "Ally Rez",
  "icon": "empathy_resurrect.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 120,
    "endurance": 5.2,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 1,
    "table": "Ranged_Ones",
    "duration": 0.5,
    "tickRate": 1
  },
  "effects": {
    "enduranceGain": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
