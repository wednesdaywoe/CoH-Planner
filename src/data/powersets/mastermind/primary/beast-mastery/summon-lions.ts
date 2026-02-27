/**
 * Summon Lions
 * Summon Lions
 *
 * Source: mastermind_summon/beast_mastery/summon_lions.json
 */

import type { Power } from '@/types';

export const SummonLions: Power = {
  "name": "Summon Lions",
  "internalName": "Summon_Lions",
  "available": 11,
  "description": "You can summon one to two mighty lions (depending on your level). Lions are one of the most deadly predators on the planet and possess vicious claw and bite attacks as well as growl and roar buffs and debuffs. Like all Henchmen, Lions can be trained to be even more powerful.You may only have 2 Lions under your control at any given time. If you attempt to summon more Lions, you can only replace the ones you have lost in battle. If you already have two, the power will fail.Lion attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.Notes: Summon Lions is unaffected by Recharge Time changes.Recharge: Moderate.",
  "shortHelp": "Summon Lions",
  "icon": "beastmastery_summonlions.png",
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
    "Stun",
    "Run Speed",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Running",
    "Running & Sprints",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Lioness",
      "copyBoosts": true,
      "entityCount": 2
    }
  }
};
