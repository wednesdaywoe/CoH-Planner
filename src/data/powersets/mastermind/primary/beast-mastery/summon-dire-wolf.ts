/**
 * Summon Dire Wolf
 * Summon Dire Wolf
 *
 * Source: mastermind_summon/beast_mastery/summon_dire_wolf.json
 */

import type { Power } from '@/types';

export const SummonDireWolf: Power = {
  "name": "Summon Dire Wolf",
  "internalName": "Summon_Dire_Wolf",
  "available": 21,
  "description": "You call upon the aid of the fabled Dire Wolf. It has powerful bite and breath attacks. Unlike wolves and lions, the Dire Wolf has some limited ranged attacks. The Dire Wolf has good defense to Melee, Ranged and AoE attacks and good resistance to Cold damage.Dire Wolf attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.",
  "shortHelp": "Summon Dire Wolf",
  "icon": "beastmastery_summondirewolves.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 15,
    "endurance": 13.18,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Fear",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Fear",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Running",
    "Running & Sprints",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Dire_Wolf",
      "copyBoosts": true
    }
  }
};
