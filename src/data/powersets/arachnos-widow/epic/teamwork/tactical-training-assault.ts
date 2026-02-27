/**
 * Tactical Training: Assault
 * Toggle: PBAoE, Team +DMG, Res(Taunt, Placate)
 *
 * Source: teamwork/teamwork/tactical_training:_assault.json
 */

import type { Power } from '@/types';

export const TacticalTrainingAssault: Power = {
  "name": "Tactical Training: Assault",
  "available": 15,
  "description": "While this power is active, you and your nearby teammates deal more damage and are more resistant to Taunt and Placate.",
  "shortHelp": "Toggle: PBAoE, Team +DMG, Res(Taunt, Placate)",
  "icon": "teamwork_tacticaltrainingassault.png",
  "powerType": "Toggle",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "recharge": 15,
    "endurance": 0.416,
    "castTime": 1.5,
    "radius": 80,
    "maxTargets": 255
  },
  "targetType": "Self",
  "effects": {
    "damageBuff": {
      "scale": 1.5,
      "table": "Ranged_Buff_Dmg"
    }
  }
};
