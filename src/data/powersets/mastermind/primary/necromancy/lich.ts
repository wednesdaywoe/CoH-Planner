/**
 * Lich
 * Summon Lich
 *
 * Source: mastermind_summon/necromancy/lich.json
 */

import type { Power } from '@/types';

export const Lich: Power = {
  "name": "Lich",
  "internalName": "Lich",
  "available": 21,
  "description": "Summons a dark and powerful Lich. The lich is an undead entity that, when alive, possessed many dark powers of his own. Perhaps it was a dark wizard, or powerful arch villain. Perhaps it was even a Necromancer. Now it only hungers for the souls of the living, and is quite good at feeding itself. The Lich specializes in dark control and draining powers.",
  "shortHelp": "Summon Lich",
  "icon": "necromancy_summonlitch.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 15,
    "endurance": 13.18,
    "castTime": 3.17
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Fear",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Fear",
    "Holds",
    "Immobilize",
    "Knockback",
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
      "entity": "MastermindPets_Lich",
      "copyBoosts": true
    }
  }
};
