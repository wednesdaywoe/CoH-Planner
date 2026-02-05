/**
 * Protector Bots
 * Summon Protector Bot
 *
 * Source: mastermind_summon/robotics/protector_bots.json
 */

import type { Power } from '@/types';

export const ProtectorBots: Power = {
  "name": "Protector Bots",
  "internalName": "Protector_Bots",
  "available": 11,
  "description": "You can summon one to two powerful Protector Bots (depending on your level). Protector Bots can defend your army by placing Force Fields on you and your allies. They can even be equipped to repair your other Robot Henchmen. Make no mistake though, the best defense is a good offense, and Protector Bots are well equipped with energy weapons.You may only have 2 Protector Bots under your control at any given time. If you attempt to summon more Protector Bots, you can only replace the ones you have lost in battle. If you already have two, the power will fail.Notes: Protector Bots is unaffected by Recharge Time changes.",
  "shortHelp": "Summon Protector Bot",
  "icon": "robotics_constructprotectorbot.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 10,
    "endurance": 9.62,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Defense Sets",
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Stuns",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Protector_Bot"
    }
  }
};
