/**
 * Repel
 * Toggle: Self AoE Knockback
 *
 * Source: controller_buff/kinetics/repel.json
 */

import type { Power } from '@/types';

export const Repel: Power = {
  "name": "Repel",
  "internalName": "Repel",
  "available": 3,
  "description": "Repel creates a zone of kinetic energy that violently repels nearby foes. Each villain that is repelled costs additional Endurance.Recharge: Slow.",
  "shortHelp": "Toggle: Self AoE Knockback",
  "icon": "kineticboost_repel.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 9,
    "recharge": 20,
    "endurance": 0.325,
    "castTime": 1.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
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
