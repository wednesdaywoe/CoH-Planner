/**
 * Tactical Training: Leadership
 * Toggle: PBAoE, Team +To Hit, Res(Confuse, Fear), +Perception
 *
 * Source: teamwork/teamwork/tactical_training:_leadership.json
 */

import type { Power } from '@/types';

export const TacticalTrainingLeadership: Power = {
  "name": "Tactical Training: Leadership",
  "available": 19,
  "description": "While this power is active, your chance to hit and that of all your nearby teammates' is increased. Your advanced Tactics also protect you and your team from Confuse and Fear effects, as well as your Perception so you can detect Stealthy foes.",
  "shortHelp": "Toggle: PBAoE, Team +To Hit, Res(Confuse, Fear), +Perception",
  "icon": "teamwork_tacticaltrainingleadership.png",
  "powerType": "Toggle",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
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
    "tohitBuff": {
      "scale": 1,
      "table": "Ranged_Buff_ToHit"
    },
    "perceptionBuff": {
      "scale": 2,
      "table": "Ranged_Res_Boolean"
    },
    "confuse": {
      "mag": 1,
      "scale": 1.75,
      "table": "Ranged_Res_Boolean"
    },
    "fear": {
      "mag": 1,
      "scale": 1.75,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 2.25
  }
};
