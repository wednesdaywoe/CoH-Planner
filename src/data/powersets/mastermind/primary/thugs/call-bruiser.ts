/**
 * Call Bruiser
 * Summon Bruiser
 *
 * Source: mastermind_summon/thugs/call_bruiser.json
 */

import type { Power } from '@/types';

export const CallBruiser: Power = {
  "name": "Call Bruiser",
  "internalName": "Call_Bruiser",
  "available": 21,
  "description": "Calls one massive Bruiser. He is strong, tough and has a mean temper. As a Brute, he will generate Fury and deal more damage the longer the combat lasts. His Super Strength powers means he favors hand to hand combat. He has resistance to Lethal and Smashing Damage and some resistance to Fire and Cold Damage.You may only have 1 Bruiser under your control at any given time. If you attempt to summon another Bruiser the power will fail.Notes: Call Bruiser is unaffected by Recharge Time changes.Recharge: Slow.",
  "shortHelp": "Summon Bruiser",
  "icon": "thugs_enlistboss.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 15,
    "endurance": 13.18,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Thug_Boss"
    }
  }
};
