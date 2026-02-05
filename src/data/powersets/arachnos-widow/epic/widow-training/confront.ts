/**
 * Confront
 * Ranged, Foe Taunt
 *
 * Source: arachnos-widow/widow-training
 */

import type { Power } from '@/types';

export const Confront: Power = {
  "name": "Confront",
  "available": 17,
  "description": "Challenges a foe to attack you. Useful to pull a villain off an ally who finds himself in over his head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
  "shortHelp": "Ranged, Foe Taunt",
  "icon": "widowtraining_confront.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Taunt",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 3,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
