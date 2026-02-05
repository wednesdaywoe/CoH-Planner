/**
 * Heat Exhaustion
 * Ranged Foe -DMG, -END, -Recovery, -Regeneration
 *
 * Source: defender_buff/thermal_radiation/heat_exhaustion.json
 */

import type { Power } from '@/types';

export const HeatExhaustion: Power = {
  "name": "Heat Exhaustion",
  "internalName": "Heat_Exhaustion",
  "available": 21,
  "description": "Overwhelm a single foe with waves of exhausting heat. The initial effect will drain the target of some Endurance, but the heat is so overwhelming that the affected target will be weakened. Their Damage output, Endurance Recovery and Hit Point Regeneration will all be reduced.",
  "shortHelp": "Ranged Foe -DMG, -END, -Recovery, -Regeneration",
  "icon": "thermalradiation_heatexhaustion.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 120,
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
    "damageDebuff": {
      "scale": 5,
      "table": "Ranged_Debuff_Dam"
    },
    "regenDebuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    },
    "enduranceDrain": {
      "scale": 0.13,
      "table": "Ranged_EndDrain"
    }
  }
};
