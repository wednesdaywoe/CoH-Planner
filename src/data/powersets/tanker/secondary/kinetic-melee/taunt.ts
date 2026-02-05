/**
 * Taunt
 * Ranged (Targeted AoE), Foe Taunt
 *
 * Source: tanker_melee/kinetic_attack/taunt.json
 */

import type { Power } from '@/types';

export const Taunt: Power = {
  "name": "Taunt",
  "internalName": "Taunt",
  "available": 9,
  "description": "Taunts a foe, and some nearby foes, to attack you. Useful for pulling villains off an ally who find themselves in over their head. Taunted foes tend to ignore other Heroes and focus on you for quite a while, so use this power cautiously. A To Hit check is required to Taunt enemy players, but is not needed against critter targets.",
  "shortHelp": "Ranged (Targeted AoE), Foe Taunt",
  "icon": "kineticattack_taunt.png",
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
    "taunt": {
      "scale": 20,
      "table": "Melee_Taunt"
    },
    "rangeBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
