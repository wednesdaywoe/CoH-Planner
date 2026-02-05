/**
 * Transference
 * Ranged (Targeted AoE), Target -End, Team +Recovery, Special
 *
 * Source: mastermind_buff/kinetics/transference.json
 */

import type { Power } from '@/types';

export const Transference: Power = {
  "name": "Transference",
  "internalName": "Transference",
  "available": 27,
  "description": "Transference drains an enemy of some of their Endurance and transfers that Endurance to all allies near the affected foe. You can use Transference to recover Endurance for yourself as well as your allies.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Target -End, Team +Recovery, Special",
  "icon": "kineticboost_transferance.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 60,
    "recharge": 30,
    "endurance": 3.25,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceDrain": {
      "scale": 0.45,
      "table": "Ranged_EndDrain"
    }
  }
};
