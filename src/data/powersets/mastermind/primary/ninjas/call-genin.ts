/**
 * Call Genin
 * Summon Genin
 *
 * Source: mastermind_summon/ninjas/call_genin.json
 */

import type { Power } from '@/types';

export const CallGenin: Power = {
  "name": "Call Genin",
  "internalName": "Call_Genin",
  "available": 0,
  "description": "Calls forth one to three Genin Ninja (depending on your level) to do your bidding. Genin have good reflexes and jumping skill, but they are still the lowest rank Ninja and only possess the most rudimentary skills, However, they can be trained in more advanced techniques and weapons.You may only have 3 Genin under your control at any given time. If you attempt to call Genin, you can only replace the ones you have lost in battle. If you already have three, the power will fail.Notes: Call Genin is unaffected by Recharge Time changes.",
  "shortHelp": "Summon Genin",
  "icon": "ninjas_callgenin.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 5.46,
    "castTime": 1.7
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Genin"
    }
  }
};
