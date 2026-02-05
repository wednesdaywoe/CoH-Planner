/**
 * Regeneration Aura
 * PBAoE, Ally +Regeneration
 *
 * Source: corruptor_buff/empathy/regeneration_aura.json
 */

import type { Power } from '@/types';

export const RegenerationAura: Power = {
  "name": "Regeneration Aura",
  "internalName": "Regeneration_Aura",
  "available": 27,
  "description": "The Regeneration Aura dramatically increases the healing rate of all nearby heroes for a limited time. Emitting this Aura costs you a lot of Endurance, and it takes a long time to recharge.Recharge: Very Long.",
  "shortHelp": "PBAoE, Ally +Regeneration",
  "icon": "empathy_regenerationaura.png",
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
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    }
  }
};
