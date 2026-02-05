/**
 * Plasma Shield
 * Ranged, Ally +Res(Energy, Negative, Fire)
 *
 * Source: controller_buff/thermal_radiation/plasma_shield.json
 */

import type { Power } from '@/types';

export const PlasmaShield: Power = {
  "name": "Plasma Shield",
  "internalName": "Plasma_Shield",
  "available": 9,
  "description": "Envelope an ally in pure plasma. The Plasma Shield gives your ally resistance to Energy, Negative Energy, and Fire damage. You cannot stack multiple Plasma Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Fire Shield. You cannot use this power on yourself.",
  "shortHelp": "Ranged, Ally +Res(Energy, Negative, Fire)",
  "icon": "thermalradiation_plasmashield.png",
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
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
