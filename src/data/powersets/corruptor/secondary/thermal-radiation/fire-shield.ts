/**
 * Fire Shield
 * Ranged, Ally +Res(Fire, Lethal, Smash, Cold)
 *
 * Source: corruptor_buff/thermal_radiation/fire_shield.json
 */

import type { Power } from '@/types';

export const FireShield: Power = {
  "name": "Fire Shield",
  "internalName": "Fire_Shield",
  "available": 0,
  "description": "Casts a Fire Shield on one of your allies and grants him damage resistance to Lethal, Smashing and Fire damage. Fire Shield also provides minimal resistance to Cold damage. You cannot stack multiple Fire Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Plasma Shield. You cannot use this power on yourself.",
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
