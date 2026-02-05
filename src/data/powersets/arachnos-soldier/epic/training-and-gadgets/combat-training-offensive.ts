/**
 * Combat Training: Offensive
 * Auto: Self +ACC
 *
 * Source: arachnos-soldier/training-and-gadgets
 */

import type { Power } from '@/types';

export const CombatTrainingOffensive: Power = {
  "name": "Combat Training: Offensive",
  "available": 3,
  "description": "Your accuracy is improved.",
  "shortHelp": "Auto: Self +ACC",
  "icon": "trainingandgadgets_combattrainingoffensive.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Accuracy"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "recharge": 4
  },
  "targetType": "Self"
};
