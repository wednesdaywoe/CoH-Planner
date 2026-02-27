/**
 * Static Discharge
 * Ranged (Cone), Light DMG(Energy), -END
 *
 * Source: dominator_assault/electricity_manipulation/thunder_strike.json
 */

import type { Power } from '@/types';

export const StaticDischarge: Power = {
  "name": "Static Discharge",
  "internalName": "Thunder_Strike",
  "available": 23,
  "description": "Discharges a cone of Static Electricity that deals damage and drains Endurance from all affected foes in the area.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Light DMG(Energy), -END",
  "icon": "electricalassault_staticdischarge.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 0.7854,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.23,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 4.29,
      "table": "Ranged_Ones"
    }
  }
};
