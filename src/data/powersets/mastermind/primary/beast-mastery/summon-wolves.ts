/**
 * Summon Wolves
 * Summon Wolves
 *
 * Source: mastermind_summon/beast_mastery/summon_wolves.json
 */

import type { Power } from '@/types';

export const SummonWolves: Power = {
  "name": "Summon Wolves",
  "internalName": "Summon_Wolves",
  "available": 0,
  "description": "Calls forth one to three Wolves to do your bidding. The third one summoned will be an Alpha Wolf, which grants some leadership bonuses to the pack. Wolves have no ranged attacks, but can quickly close in on their prey.You may only have 3 Wolves under your control at any given time. If you attempt to call more Wolves, you can only replace the ones you have lost in battle. If you already have three, the power will fail.Wolf attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.",
  "shortHelp": "Summon Wolves",
  "icon": "beastmastery_summonwolves.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 5.46,
    "castTime": 1.97
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "ToHit Debuff",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate To-Hit Debuff",
    "Defense Debuff",
    "Healing",
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Running",
    "Running & Sprints",
    "To Hit Buff",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "copyBoosts": true,
      "entities": [
        {
          "entity": "MastermindPets_Howler_Wolf",
          "count": 2
        },
        {
          "entity": "MastermindPets_Howler_Wolf_Alpha",
          "count": 1
        }
      ]
    }
  }
};
