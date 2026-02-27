/**
 * Combat Training: Defensive
 * Auto: Self +DEF(Melee)
 *
 * Source: teamwork/teamwork/combat_training:_defensive.json
 */

import type { Power } from '@/types';

export const CombatTrainingDefensive: Power = {
  "name": "Combat Training: Defensive",
  "available": 0,
  "description": "You are more evasive to melee attacks.",
  "shortHelp": "Auto: Self +DEF(Melee)",
  "icon": "teamwork_combattrainingdefensive.png",
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
      "melee": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
