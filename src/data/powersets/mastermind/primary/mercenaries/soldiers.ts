/**
 * Soldiers
 * Summon Soldier
 *
 * Source: mastermind_summon/mercenaries/soldiers.json
 */

import type { Power } from '@/types';

export const Soldiers: Power = {
  "name": "Soldiers",
  "internalName": "Soldiers",
  "available": 0,
  "description": "Calls forth one to three Mercenary Soldiers (depending on your level) to do your bidding. The third Soldier you gain will be a Medic. All Soldiers use Sub Machine Guns, but these can be upgraded.You may only have 3 Soldiers under your control at any given time. If you attempt to call more Soldiers, you can only replace the ones you have lost in battle. If you already have three, the power will fail.",
  "shortHelp": "Summon Soldier",
  "icon": "paramilitary_draftarmy.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 5,
    "endurance": 5.46,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Healing",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Healing",
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
      "copyBoosts": true,
      "entities": [
        {
          "entity": "MastermindPets_Soldier",
          "count": 2
        },
        {
          "entity": "MastermindPets_Medic",
          "count": 1
        }
      ]
    }
  }
};
