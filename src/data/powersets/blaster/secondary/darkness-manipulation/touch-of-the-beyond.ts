/**
 * Touch of the Beyond
 * Fear, Foe -To Hit, Self +Regeneration, +Recovery, +Res(Fear)
 *
 * Source: blaster_support/darkness_manipulation/touch_of_fear.json
 */

import type { Power } from '@/types';

export const TouchoftheBeyond: Power = {
  "name": "Touch of the Beyond",
  "internalName": "Touch_of_Fear",
  "available": 19,
  "description": "The Netherworld is one scary place, and with but a touch, you can give your enemy a glimpse into this dark world. This will cause them to helplessly tremble in Fear. Foes in this state of panic have reduced chance to hit. Additionally, drawing upon this connection to the Netherworld causes you to rapidly regenerate health and recover endurance for a short time.Notes: Touch of the Beyond is unaffected by Range changes.",
  "shortHelp": "Fear, Foe -To Hit, Self +Regeneration, +Recovery, +Res(Fear)",
  "icon": "darknessmanipulation_touchoffear.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 10,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Fear",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Endurance Modification",
    "Fear",
    "Healing",
    "To Hit Debuff"
  ],
  "maxSlots": 6
};
