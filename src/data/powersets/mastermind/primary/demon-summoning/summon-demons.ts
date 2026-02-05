/**
 * Summon Demons
 * Summon Demons
 *
 * Source: mastermind_summon/demon_summoning/summon_demons.json
 */

import type { Power } from '@/types';

export const SummonDemons: Power = {
  "name": "Summon Demons",
  "internalName": "Summon_Demons",
  "available": 11,
  "description": "Summons forth one to two Demons (depending on your level) to do your bidding. One is cloaked in hellfire and has skin as hard as stone while the other manipulates flame.You may only have 2 Demons under your control at any given time. If you attempt to call more Demons, you can only replace the ones you have lost in battle. If you already have your maximum allowed number, the power will fail.Notes: Summon Demons is unaffected by Recharge Time changes.Recharge: Moderate.",
  "shortHelp": "Summon Demons",
  "icon": "demonsummoning_summondemons.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 10,
    "endurance": 9.62,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Healing",
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Resist Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Hellfire_Gargoyle"
    }
  }
};
