/**
 * Earsplitter
 * Melee, DMG(Energy/Smash), Foe Chance for Hold
 *
 * Source: blaster_support/sonic_manipulation/earsplitter.json
 */

import type { Power } from '@/types';

export const Earsplitter: Power = {
  "name": "Earsplitter",
  "internalName": "Earsplitter",
  "available": 29,
  "description": "You generate an earsplitting sound wave right in the face of your foe, inflicting great damage. It has a good chance of causing a migraine, leaving them shaking in pain and helpless.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Chance for Hold",
  "icon": "sonicmanipulation_earsplitter.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.97
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Holds",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.78,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.78,
      "table": "Melee_Damage"
    }
  ]
};
