/**
 * Combat Training: Defensive
 * Auto: Self +DEF(Ranged)
 *
 * Source: training_gadgets/training_and_gadgets/combat_training:_defensive.json
 */

import type { Power } from '@/types';

export const CombatTrainingDefensive: Power = {
  "name": "Combat Training: Defensive",
  "available": 1,
  "description": "You are more evasive to ranged attacks.",
  "shortHelp": "Auto: Self +DEF(Ranged)",
  "icon": "trainingandgadgets_combattrainingdefensive.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 4
  },
  "targetType": "Self",
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
