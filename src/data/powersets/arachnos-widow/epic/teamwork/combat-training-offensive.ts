/**
 * Combat Training: Offensive
 * Auto: Self +ACC
 *
 * Source: arachnos-widow/teamwork
 */

import type { Power } from '@/types';

export const CombatTrainingOffensive: Power = {
  "name": "Combat Training: Offensive",
  "available": 1,
  "description": "Your accuracy is improved.",
  "shortHelp": "Auto: Self +ACC",
  "icon": "teamwork_combattrainingoffensive.png",
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
