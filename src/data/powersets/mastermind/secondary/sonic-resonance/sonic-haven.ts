/**
 * Sonic Haven
 * Ranged, Ally +Res(Fire, Cold, Energy, Negative Energy)
 *
 * Source: mastermind_buff/sonic_resonance/sonic_haven.json
 */

import type { Power } from '@/types';

export const SonicHaven: Power = {
  "name": "Sonic Haven",
  "internalName": "Sonic_Haven",
  "available": 3,
  "description": "This shield dramatically reduces the damage an ally takes from Fire, Cold, Energy, and Negative Energy attacks for a limited time. You cannot stack multiple Sonic Havens on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Sonic Barrier. You cannot use this power on yourself.Recharge: Very Fast.",
  "shortHelp": "Ranged, Ally +Res(Fire, Cold, Energy, Negative Energy)",
  "icon": "sonicdebuff_protectelements.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 30,
    "recharge": 2,
    "endurance": 9.75,
    "castTime": 1.33,
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
      "cold": {
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
