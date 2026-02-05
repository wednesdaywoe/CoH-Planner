/**
 * Summon Demonlings
 * Summon Demonlings
 *
 * Source: mastermind_summon/demon_summoning/summon_demonlings.json
 */

import type { Power } from '@/types';

export const SummonDemonlings: Power = {
  "name": "Summon Demonlings",
  "internalName": "Summon_Demonlings",
  "available": 0,
  "description": "Call forth up to three demonlings (depending on your level) to do your bidding. The first demonling is adept at manipulating fire, the second blasts your foes with cold attacks and the third is able to wield hellfire to deal fire/toxic damage.You may only have three demonlings under your command at any given time. If you attempt to summon more demonlings, you can only replace those that have been lost in battle. If you already have your maximum allowed amount, the power will fail.Notes: Summon Demonlings is unaffected by Recharge Time changes.Recharge: Fast.",
  "shortHelp": "Summon Demonlings",
  "icon": "demonsummoning_summondemonlings.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 5.46,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Hellfire_Demonling"
    }
  }
};
