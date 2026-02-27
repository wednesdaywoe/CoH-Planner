/**
 * Recovery Aura
 * PBAoE, Ally +Recovery
 *
 * Source: controller_buff/empathy/recovery_aura.json
 */

import type { Power } from '@/types';

export const RecoveryAura: Power = {
  "name": "Recovery Aura",
  "internalName": "Recovery_Aura",
  "available": 23,
  "description": "The Recovery Aura dramatically increases the Endurance recovery rate of all nearby heroes for a limited time. Emitting this Aura costs you a lot of Endurance, and it takes a long time to recharge.Recharge: Very Long.",
  "shortHelp": "PBAoE, Ally +Recovery",
  "icon": "empathy_recoveryaura.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 500,
    "endurance": 26,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    }
  }
};
