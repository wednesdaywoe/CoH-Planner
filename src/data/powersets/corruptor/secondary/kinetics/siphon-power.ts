/**
 * Siphon Power
 * Ranged, Foe -DMG, Team +DMG
 *
 * Source: corruptor_buff/kinetics/siphon_power.json
 */

import type { Power } from '@/types';

export const SiphonPower: Power = {
  "name": "Siphon Power",
  "internalName": "Siphon_Power",
  "available": 0,
  "description": "You can Siphon the Power from a targeted foe, reducing his damage potential. The power is transferred back to you, increasing your own damage potential and that of all nearby allies.Recharge: Slow.",
  "shortHelp": "Ranged, Foe -DMG, Team +DMG",
  "icon": "kineticboost_siphonpower.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 20,
    "endurance": 10.4,
    "castTime": 1.93
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
