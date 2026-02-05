/**
 * Mask Presence
 * Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)
 *
 * Source: arachnos-widow/fortunata-teamwork
 */

import type { Power } from '@/types';

export const MaskPresence: Power = {
  "name": "Mask Presence",
  "available": 19,
  "description": "Mask Presence makes you almost impossible to detect. When you attack or are damaged while using this power, you will be discovered. Even if discovered, you are hard to see and retain some bonus to Defense.",
  "shortHelp": "Toggle: Self Stealth, +DEF(Melee, Ranged, AoE)",
  "icon": "fortunatateamwork_maskpresence.png",
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
