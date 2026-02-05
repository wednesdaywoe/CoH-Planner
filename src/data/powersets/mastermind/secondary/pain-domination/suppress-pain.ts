/**
 * Suppress Pain
 * Toggle: PBAoE, Ally +Regeneration
 *
 * Source: mastermind_buff/pain_domination/soothing_aura.json
 */

import type { Power } from '@/types';

export const SuppressPain: Power = {
  "name": "Suppress Pain",
  "internalName": "Soothing_Aura",
  "available": 19,
  "description": "While this power is active all nearby allies will have their regeneration rate increased dramatically.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Ally +Regeneration",
  "icon": "paindomination_soothingaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 10,
    "endurance": 0.975,
    "castTime": 1.67,
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
      "scale": 2,
      "table": "Ranged_Ones"
    }
  }
};
