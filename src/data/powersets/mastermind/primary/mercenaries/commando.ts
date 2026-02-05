/**
 * Commando
 * Summon Commando
 *
 * Source: mastermind_summon/mercenaries/commando.json
 */

import type { Power } from '@/types';

export const Commando: Power = {
  "name": "Commando",
  "internalName": "Commando",
  "available": 21,
  "description": "Enlists one highly trained Commando. The Commando is a seasoned professional who favors heavy assault weapons. He is simply a one man army that can leave a wake of destruction in his path. In addition to standard Soldier resistance, the Commandos experience also makes him resistant to Fear and his rugged advanced training makes him slightly resistant to Fire, Cold and Toxic Damage.You may only have 1 Commando under your control at any given time. If you attempt to summon another Commando, the power will fail.Notes: Commando is unaffected by Recharge Time changes.",
  "shortHelp": "Summon Commando",
  "icon": "paramilitary_supersoldier.png",
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
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Commando"
    }
  }
};
