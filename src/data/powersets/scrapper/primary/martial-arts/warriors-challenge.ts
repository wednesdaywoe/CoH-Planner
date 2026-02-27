/**
 * Warriors Challenge
 * Ranged, Foe Taunt
 *
 * Source: scrapper_melee/martial_arts/warriors_challenge.json
 */

import type { Power } from '@/types';

export const WarriorsChallenge: Power = {
  "name": "Warriors Challenge",
  "internalName": "Warriors_Challenge",
  "available": 11,
  "description": "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
  "shortHelp": "Ranged, Foe Taunt",
  "icon": "martialarts_warrior'schallenge.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 3,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Taunt",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "taunt": {
      "scale": 15,
      "table": "Melee_Taunt"
    },
    "rangeBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    }
  }
};
