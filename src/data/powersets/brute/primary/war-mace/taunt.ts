/**
 * Taunt
 * Ranged (Targeted AoE), Foe Taunt
 *
 * Source: brute_melee/war_mace/taunt.json
 */

import type { Power } from '@/types';

export const Taunt: Power = {
  "name": "Taunt",
  "internalName": "Taunt",
  "available": 11,
  "description": "Taunt foes to attack you. Useful to pull enemies off allies and keep them attacking you to raise your Fury. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.Recharge: Moderate.",
  "shortHelp": "Ranged (Targeted AoE), Foe Taunt",
  "icon": "mace_taunt.png",
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
      "scale": 20,
      "table": "Melee_Taunt"
    },
    "rangeBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    }
  }
};
