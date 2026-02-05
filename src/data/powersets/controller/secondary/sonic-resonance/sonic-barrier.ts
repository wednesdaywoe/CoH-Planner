/**
 * Sonic Barrier
 * Ranged, Ally +Res(Smash, Lethal, Toxic)
 *
 * Source: controller_buff/sonic_debuff/sonic_barrier.json
 */

import type { Power } from '@/types';

export const SonicBarrier: Power = {
  "name": "Sonic Barrier",
  "internalName": "Sonic_Barrier",
  "available": 0,
  "description": "This shield dramatically reduces the damage an ally takes from Smashing, Lethal, and Toxic attacks for a limited time. You cannot stack multiple Sonic Barriers on the same target; however, the shield can be improved by another ally using the same power. Can also be used in conjunction with your Sonic Haven. You cannot use this power on yourself.Recharge: Very Fast.",
  "shortHelp": "Ranged, Ally +Res(Smash, Lethal, Toxic)",
  "icon": "sonicdebuff_protectphysical.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 30,
    "recharge": 2,
    "endurance": 7.8,
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
      "smashing": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
