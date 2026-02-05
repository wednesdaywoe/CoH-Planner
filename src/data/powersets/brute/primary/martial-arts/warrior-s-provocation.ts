/**
 * Warrior's Provocation
 * Ranged (Targeted AoE), Foe Taunt
 *
 * Source: brute_melee/martial_arts/warriors_provocation.json
 */

import type { Power } from '@/types';

export const WarriorsProvocation: Power = {
  "name": "Warrior's Provocation",
  "internalName": "Warriors_Provocation",
  "available": 11,
  "description": "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
  "shortHelp": "Ranged (Targeted AoE), Foe Taunt",
  "icon": "martialarts_warriorsprovocation.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 15,
    "recharge": 10,
    "castTime": 1.67,
    "maxTargets": 5
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
      "scale": 20,
      "table": "Melee_Taunt"
    }
  }
};
