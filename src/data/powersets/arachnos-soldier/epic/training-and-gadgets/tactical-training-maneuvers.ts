/**
 * Tactical Training: Maneuvers
 * PBAoE, Team +DEF(All)
 *
 * Source: arachnos-soldier/training-and-gadgets
 */

import type { Power } from '@/types';

export const TacticalTrainingManeuvers: Power = {
  "name": "Tactical Training: Maneuvers",
  "available": 9,
  "description": "A good leader knows how to protect his team. While active, this power increases the Defense of yourself and all nearby teammates to all attacks.",
  "shortHelp": "PBAoE, Team +DEF(All)",
  "icon": "trainingandgadgets_tacticaltrainingmaneuvers.png",
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
    "radius": 60,
    "maxTargets": 255
  },
  "targetType": "Self"
};
