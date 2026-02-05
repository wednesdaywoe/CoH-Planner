/**
 * Glowing Touch
 * Ally Heal
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const GlowingTouch: Power = {
  "name": "Glowing Touch",
  "available": 19,
  "description": "Heals a single targeted ally at moderate range. You cannot use this power to heal yourself.  Recharge: Fast.",
  "shortHelp": "Ally Heal",
  "icon": "luminousblast_glowingtouch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 13,
    "castTime": 2.27
  },
  "targetType": "Ally (Alive)"
};
