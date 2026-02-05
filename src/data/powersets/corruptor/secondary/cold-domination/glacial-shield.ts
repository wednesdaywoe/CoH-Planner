/**
 * Glacial Shield
 * Ranged, Ally +DEF(Ranged, AoE, Energy, Negative), Res(Cold)
 *
 * Source: corruptor_buff/cold_domination/glacial_shield.json
 */

import type { Power } from '@/types';

export const GlacialShield: Power = {
  "name": "Glacial Shield",
  "internalName": "Glacial_Shield",
  "available": 9,
  "description": "Envelopes an ally in gleaming Glacial Ice. Its crystalline structure has refracting properties that grants the target good Defense against Area Effect, Ranged, Energy and Negative Energy attacks. Glacial Shield also grants the target some damage resistance to Cold. You cannot stack multiple Glacial Shields on the same target, however the shield can be improved by another ally using the same power. Can also be used in conjunction with your Ice Shield. You cannot use this power on yourself.Recharge: Very Fast.",
  "shortHelp": "Ranged, Ally +DEF(Ranged, AoE, Energy, Negative), Res(Cold)",
  "icon": "colddomination_glaciate.png",
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
    "Defense Sets",
    "Resist Damage"
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
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      }
    },
    "resistance": {
      "cold": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
