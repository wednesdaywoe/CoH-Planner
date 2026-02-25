/**
 * Battle Drones
 * Summon Battle Drones
 *
 * Source: mastermind_summon/robotics/battle_drones.json
 */

import type { Power } from '@/types';

export const BattleDrones: Power = {
  "name": "Battle Drones",
  "internalName": "Battle_Drones",
  "available": 0,
  "description": "Construct one to three Battle Drones (depending on your level) to do your bidding. Drones start out with only basic weaponry, but can be upgraded with heavier energy weapons. Drones can Super Leap.You may only have 3 Drones under your control at any given time. If you attempt to construct more Drones, you can only replace the ones you have lost in battle. If you already have three, the power will fail.",
  "shortHelp": "Summon Battle Drones",
  "icon": "robotics_buildrobotarmy.png",
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
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
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
      "entity": "MastermindPets_Droid",
      "copyBoosts": true,
      "entityCount": 3
    }
  }
};
