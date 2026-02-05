/**
 * Insulation Shield
 * Ranged, Ally +DEF(Fire, Cold, Energy, Negative, Ranged, AoE), Res (End Drain)
 *
 * Source: mastermind_buff/force_field/insulation_shield.json
 */

import type { Power } from '@/types';

export const InsulationShield: Power = {
  "name": "Insulation Shield",
  "internalName": "Insulation_Shield",
  "available": 3,
  "description": "Dramatically protects an ally from Fire, Cold, Energy, Negative Energy, Ranged and AoE attacks for a limited time. The Insulation also protects the target from Endurance Draining effects. You cannot stack multiple Insulation Shields on the same target; however, the shield can be improved by another ally using the same power. Can also be used in conjunction with your Deflection Shield. In PvP, this power also grants a small amount of Mez Protection to its primary target. You cannot use this power on yourself.",
  "shortHelp": "Ranged, Ally +DEF(Fire, Cold, Energy, Negative, Ranged, AoE), Res (End Drain)",
  "icon": "forcefield_insulationshield.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 30,
    "recharge": 2,
    "endurance": 9.75,
    "castTime": 2.07,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      }
    },
    "enduranceGain": {
      "scale": 2,
      "table": "Ranged_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 2,
      "table": "Ranged_Res_Boolean"
    }
  }
};
