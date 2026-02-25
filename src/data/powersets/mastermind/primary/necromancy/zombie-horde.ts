/**
 * Zombie Horde
 * Summon Zombies
 *
 * Source: mastermind_summon/necromancy/zombie_horde.json
 */

import type { Power } from '@/types';

export const ZombieHorde: Power = {
  "name": "Zombie Horde",
  "internalName": "Zombie_Horde",
  "available": 0,
  "description": "Summons one to three Zombies (depending on your level) to do your bidding. Zombies are very tough but can be slow and stupid. They start out with only rudimentary melee attacks, but can be empowered with range and even life draining powers.You may only have 3 Zombies under your control at any given time. If you attempt to summon more Zombies, you can only replace the ones you have lost in battle. If you already have three, the power will fail.",
  "shortHelp": "Summon Zombies",
  "icon": "necromancy_callzombiehorde.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 5.46,
    "castTime": 3.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Zombie",
      "copyBoosts": true,
      "entityCount": 3
    }
  }
};
