/**
 * Aim
 * Self +To Hit, +DMG
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const Aim: Power = {
  "name": "Aim",
  "available": 5,
  "description": "Greatly increases your chance to hit with attacks for a few seconds. Slightly increases damage.",
  "shortHelp": "Self +To Hit, +DMG",
  "icon": "fortunatatraining_aim.png",
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
