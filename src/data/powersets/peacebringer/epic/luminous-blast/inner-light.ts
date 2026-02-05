/**
 * Inner Light
 * Self +DMG, +To Hit
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const InnerLight: Power = {
  "name": "Inner Light",
  "available": 9,
  "description": "Greatly increases the amount of damage you deal for a few seconds, as well as increasing your chance to hit. Light continues to burn from within you for 30 seconds, giving you a lingering damage and ToHit buff after the initial burst fades.  Recharge: Long.",
  "shortHelp": "Self +DMG, +To Hit",
  "icon": "luminousblast_buildup.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "targetType": "Self"
};
