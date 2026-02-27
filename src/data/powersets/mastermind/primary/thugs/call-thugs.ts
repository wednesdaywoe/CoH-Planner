/**
 * Call Thugs
 * Summon Punks
 *
 * Source: mastermind_summon/thugs/call_thugs.json
 */

import type { Power } from '@/types';

export const CallThugs: Power = {
  "name": "Call Thugs",
  "internalName": "Call_Thugs",
  "available": 0,
  "description": "Calls forth one to three Thugs (depending on your level) to do your bidding. The third Thug you gain will be an Arsonist. Thugs use Dual Pistols and can be taught additional pistol attacks.You may only have 3 Thugs under your control at any given time. If you attempt to call more Thugs, you can only replace the ones you have lost in battle. If you already have three, the power will fail.",
  "shortHelp": "Summon Punks",
  "icon": "thugs_hireposse.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 5.46,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "copyBoosts": true,
      "entities": [
        {
          "entity": "MastermindPets_Thug",
          "count": 2
        },
        {
          "entity": "MastermindPets_Thug_Arsonist",
          "count": 1
        }
      ]
    }
  }
};
