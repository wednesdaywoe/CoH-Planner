/**
 * Tactical Training: Maneuvers
 * PBAoE, Team +DEF(All)
 *
 * Source: teamwork/teamwork/tactical_training:_maneuvers.json
 */

import type { Power } from '@/types';

export const TacticalTrainingManeuvers: Power = {
  "name": "Tactical Training: Maneuvers",
  "available": 3,
  "description": "A good leader knows how to protect his team. While active, this power increases the Defense of yourself and all nearby teammates to all attacks.",
  "shortHelp": "PBAoE, Team +DEF(All)",
  "icon": "teamwork_tacticaltrainingmaneuvers.png",
  "powerType": "Toggle",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
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
    "defenseBuff": {
      "ranged": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Ranged_Buff_Def"
      }
    }
  }
};
