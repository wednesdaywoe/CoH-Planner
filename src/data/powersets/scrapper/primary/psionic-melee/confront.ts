/**
 * Confront
 * Ranged, Foe Taunt
 *
 * Source: scrapper_melee/psionic_melee/confront.json
 */

import type { Power } from '@/types';

export const Confront: Power = {
  "name": "Confront",
  "internalName": "Confront",
  "available": 11,
  "description": "Challenges a foe to attack you. Useful to pull a foe off an ally who finds themselves in over their head. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
  "shortHelp": "Ranged, Foe Taunt",
  "icon": "psionicmelee_confront.png",
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
