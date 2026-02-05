/**
 * Sonic Repulsion
 * Toggle: Ranged (Target Ally AoE), Foe Knockback
 *
 * Source: controller_buff/sonic_debuff/sonic__repulsion.json
 */

import type { Power } from '@/types';

export const SonicRepulsion: Power = {
  "name": "Sonic Repulsion",
  "internalName": "Sonic__Repulsion",
  "available": 23,
  "description": "You create a powerful sonic resonance around an ally, repelling all foes nearby. You will lose endurance for each target repelled.Recharge: Moderate.",
  "shortHelp": "Toggle: Ranged (Target Ally AoE), Foe Knockback",
  "icon": "sonicdebuff_teamknockback.png",
  "powerType": "Toggle",
  "targetType": "Teammate (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 10,
    "recharge": 8,
    "endurance": 0.325,
    "castTime": 2.33,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback"
  ],
  "maxSlots": 6,
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Ranged_Knockback"
    },
    "enduranceDrain": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
