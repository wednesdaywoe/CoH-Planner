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
  "description": "You call upon the aid of the fabled Dire Wolf. It has powerful bite and breath attacks. Unlike wolves and lions, the Dire Wolf has some limited ranged attacks. The Dire Wolf has good defense to Melee, Ranged and AoE attacks and good resistance to Cold damage.You may only have 1 Dire Wolf under your control at any given time. If you attempt to summon another Dire Wolf the power will fail.Dire Wolf attacks have a chance to build a charge of Pack Mentality. Pack Mentality is a Damage buff aura that radiates from the Mastermind and can stack up to 10 times.Notes: Summon Dire Wolf is unaffected by Recharge Time changes.Recharge: Slow.",
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
    "Healing",
    "Fear",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Fear",
    "Healing",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Resist Damage",
    "Running",
    "Running & Sprints",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Dire_Wolf"
    }
  }
};
