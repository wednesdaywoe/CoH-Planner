/**
 * Assault Bot
 * Summon Assault Bot
 *
 * Source: mastermind_summon/robotics/assault_bot.json
 */

import type { Power } from '@/types';

export const AssaultBot: Power = {
  "name": "Assault Bot",
  "internalName": "Assault_Bot",
  "available": 21,
  "description": "Builds one massive Assault Bot. Simply put, the Assault Bot is a killing machine. There is nothing subtle about its weaponry.You may only have 1 Assault Bot under your control at any given time. If you attempt to summon another Assault Bot, the power will fail.Notes: Assault Bot is unaffected by Recharge Time changes.",
  "shortHelp": "Summon Assault Bot",
  "icon": "robotics_assembleassaultmech.png",
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
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Assault_Bot"
    }
  }
};
