/**
 * Build Up
 * Self +DMG, +ToHit
 */

import type { Power } from '@/types';

export const BuildUp: Power = {
  "name": "Build Up",
  "available": 5,
  "description": "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your chance to hit. Recharge: Long",
  "shortHelp": "Self +DMG, +ToHit",
  "icon": "banespider_buildup.png",
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
