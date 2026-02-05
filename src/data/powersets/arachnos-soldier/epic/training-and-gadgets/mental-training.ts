/**
 * Mental Training
 * Auto: Self +Recharge, +SPD, Res (Slow)
 *
 * Source: arachnos-soldier/training-and-gadgets
 */

import type { Power } from '@/types';

export const MentalTraining: Power = {
  "name": "Mental Training",
  "available": 21,
  "description": "Your mental training allows you to focus your will, allowing you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
  "shortHelp": "Auto: Self +Recharge, +SPD, Res (Slow)",
  "icon": "trainingandgadgets_mentaltraining.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Run Speed",
    "Fly"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self"
};
