/**
 * Earsplitter
 * Melee, DMG(Energy/Smash), Foe -Res(Debuffs), Chance for Hold
 *
 * Source: scrapper_melee/sonic_melee/earsplitter.json
 */

import type { Power } from '@/types';

export const Earsplitter: Power = {
  "name": "Earsplitter",
  "internalName": "Earsplitter",
  "available": 25,
  "description": "You generate an earsplitting sound wave right in the face of your foe, inflicting great damage. It has a good chance of causing a migraine, leaving them shaking in pain and helpless. This power will inflict 20% bonus damage against Attuned targets.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe -Res(Debuffs), Chance for Hold",
  "icon": "sonicmanipulation_earsplitter.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 14,
    "endurance": 13.52,
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
    "Holds",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 2.6,
    "table": "Melee_Damage"
  }
};
