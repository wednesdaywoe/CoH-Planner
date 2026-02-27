/**
 * Call Reinforcements
 * Call Reinforcements: Ranged Moderate DMG(Lethal)
 *
 * Source: training_gadgets/training_and_gadgets/call_reinforcements.json
 */

import type { Power } from '@/types';

export const CallReinforcements: Power = {
  "name": "Call Reinforcements",
  "available": 29,
  "description": "As an Arachnos Soldier you have access to a small squadron of Arachnobot Disruptors. Two Disruptors that are one level less than you will show up when summoned.",
  "shortHelp": "Call Reinforcements: Ranged Moderate DMG(Lethal)",
  "icon": "trainingandgadgets_callreinforcements.png",
  "powerType": "Click",
  "effectArea": "Location",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceModification",
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 900,
    "endurance": 26,
    "castTime": 2.03
  },
  "targetType": "Location",
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Patron_Powers_Arachnobot_Disrupter",
      "duration": 240,
      "copyBoosts": true,
      "entityCount": 2
    }
  }
};
