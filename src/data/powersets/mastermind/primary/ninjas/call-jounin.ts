/**
 * Call Jounin
 * Summon Jounin
 *
 * Source: mastermind_summon/ninjas/call_jounin.json
 */

import type { Power } from '@/types';

export const CallJounin: Power = {
  "name": "Call Jounin",
  "internalName": "Call_Jounin",
  "available": 11,
  "description": "You can summon one to two highly skilled Jounin Ninja (depending on your level). Jounin Ninja are master assassins and expert swordsmen. They possess superior reflexes and jumping skill. Like all Henchmen, Jounin can be trained in even deadlier Ninjitsu techniques and weapons.You may only have 2 Jounin under your control at any given time. If you attempt to summon more Jounin, you can only replace the ones you have lost in battle. If you already have two, the power will fail.Notes: Call Jounin is unaffected by Recharge Time changes.",
  "shortHelp": "Summon Jounin",
  "icon": "ninjas_calljounin.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 10,
    "endurance": 9.62,
    "castTime": 1.7
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Stun",
    "Sleep",
    "ToHit Debuff",
    "Defense Debuff",
    "Damage",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate To-Hit Debuff",
    "Confuse",
    "Defense Debuff",
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Sleep",
    "Stuns",
    "Threat Duration",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Jonin"
    }
  }
};
