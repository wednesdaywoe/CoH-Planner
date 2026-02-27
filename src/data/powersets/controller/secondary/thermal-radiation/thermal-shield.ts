/**
 * Thermal Shield
 * Ranged, Ally +Res(Fire, Lethal, Smash, Cold)
 *
 * Source: controller_buff/thermal_radiation/fire_shield.json
 */

import type { Power } from '@/types';

export const ThermalShield: Power = {
  "name": "Thermal Shield",
  "internalName": "Fire_Shield",
  "available": 0,
  "description": "Casts a Thermal Shield on one of your allies and grants them damage resistance to Lethal, Smashing and Fire damage. Thermal Shield also provides minimal resistance to Cold damage. You cannot stack multiple Thermal Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Plasma Shield. You cannot use this power on yourself.",
  "shortHelp": "Ranged, Ally +Res(Fire, Lethal, Smash, Cold)",
  "icon": "thermalradiation_fireshield.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 30,
    "recharge": 2,
    "endurance": 7.8,
    "castTime": 1.17,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 1,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
