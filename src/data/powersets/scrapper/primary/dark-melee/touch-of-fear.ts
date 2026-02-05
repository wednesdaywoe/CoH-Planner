/**
 * Touch of Fear
 * Melee (Targeted AoE), DMG(Negative), Fear, Foe -To Hit
 *
 * Source: scrapper_melee/dark_melee/touch_of_fear.json
 */

import type { Power } from '@/types';

export const TouchofFear: Power = {
  "name": "Touch of Fear",
  "internalName": "Touch_of_Fear",
  "available": 5,
  "description": "The Netherworld is one scary place, and with but a touch, you can give your enemy a glimpse into this dark world. This will cause them to helplessly tremble in Fear. Foes in this state of panic have reduced chance to hit.",
  "shortHelp": "Melee (Targeted AoE), DMG(Negative), Fear, Foe -To Hit",
  "icon": "shadowfighting_touchoffearaoe.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 6,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.97,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Fear",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Fear",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
