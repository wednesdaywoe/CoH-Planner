/**
 * Cloaking Device
 * Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)
 *
 * Source: arachnos-soldier/bane-spider-training
 */

import type { Power } from '@/types';

export const CloakingDevice: Power = {
  "name": "Cloaking Device",
  "available": 23,
  "description": "Cloaking Device makes you almost impossible to detect. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense.",
  "shortHelp": "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
  "icon": "banespidertraining_cloakingdevice.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "targetType": "Self"
};
