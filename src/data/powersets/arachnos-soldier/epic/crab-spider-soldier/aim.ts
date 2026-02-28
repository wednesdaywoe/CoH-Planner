/**
 * Aim
 * Self +ToHit, +DMG
 */

import type { Power } from '@/types';

export const Aim: Power = {
  "name": "Aim",
  "available": 5,
  "description": "Greatly increases the chance to hit and damage of your attacks for a few seconds. Recharge: Long",
  "shortHelp": "Self +ToHit, +DMG",
  "icon": "crabspider_aim.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "Soldiers of Arachnos Archetype Sets",
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
