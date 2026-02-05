/**
 * Tactical Training: Leadership
 * Toggle: PBAoE, Team +To Hit, Res(Confuse, Fear), +Perception
 *
 * Source: arachnos-soldier/training-and-gadgets
 */

import type { Power } from '@/types';

export const TacticalTrainingLeadership: Power = {
  "name": "Tactical Training: Leadership",
  "available": 19,
  "description": "While this power is active, your chance to hit and that of all your nearby teammates' is increased. Your advanced Tactics also protect you and your team from Confuse and Fear effects. Additionally, your Perception is improved, allowing you to better detect Stealthy foes.",
  "shortHelp": "Toggle: PBAoE, Team +To Hit, Res(Confuse, Fear), +Perception",
  "icon": "trainingandgadgets_tacticaltrainingleadership.png",
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
    "radius": 60,
    "maxTargets": 255
  },
  "targetType": "Self"
};
