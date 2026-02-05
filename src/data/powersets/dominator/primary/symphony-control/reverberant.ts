/**
 * Reverberant
 * Summon Reverberant: Ranged Control Special
 *
 * Source: dominator_control/symphony_control/reverberant.json
 */

import type { Power } from '@/types';

export const Reverberant: Power = {
  "name": "Reverberant",
  "internalName": "Reverberant",
  "available": 25,
  "description": "You summon an entity capable of repeating your songs a short while after you have executed them. Note: This entity will execute weaker versions of your songs. Type ''/release_pets'' in the chat window to release all your pets.",
  "shortHelp": "Summon Reverberant: Ranged Control Special",
  "icon": "symphonycontrol_pet.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 20.8,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Sleep",
    "Recharge",
    "Fear",
    "Damage",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Fear",
    "Holds",
    "Immobilize",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Sleep",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Reverberant"
    }
  }
};
