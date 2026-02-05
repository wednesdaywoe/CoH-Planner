/**
 * Confront
 * Ranged, Foe Taunt
 *
 * Source: scrapper_melee/savage_melee/confront.json
 */

import type { Power } from '@/types';

export const Confront: Power = {
  "name": "Confront",
  "internalName": "Confront",
  "available": 11,
  "description": "Challenges a foe to attack you. Useful to pull a villain off an ally who finds themselves in over their head. A To Hit check required to Taunt enemy players, but is not needed against critter targets.",
  "shortHelp": "Ranged, Foe Taunt",
  "icon": "savagemelee_confront.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 3,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "rangeBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "taunt": {
      "scale": 15,
      "table": "Melee_Taunt"
    }
  }
};
