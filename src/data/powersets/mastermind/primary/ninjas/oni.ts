/**
 * Oni
 * Summon Oni
 *
 * Source: mastermind_summon/ninjas/oni.json
 */

import type { Power } from '@/types';

export const Oni: Power = {
  "name": "Oni",
  "internalName": "Oni",
  "available": 21,
  "description": "Summons an ancient and powerful Oni. An Oni is a powerful human-like demon warrior. The Oni is a formidable creature who possesses the skill of a warrior and the powers of wind and fire.You may only have 1 Oni under your control at any given time. If you attempt to summon another Oni, the power will fail.Notes: Oni is unaffected by Recharge Time changes.",
  "shortHelp": "Summon Oni",
  "icon": "ninjas_calloni.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 15,
    "endurance": 13.18,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Immobilize",
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
      "entity": "MastermindPets_Oni"
    }
  }
};
