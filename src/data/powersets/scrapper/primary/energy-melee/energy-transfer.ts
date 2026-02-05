/**
 * Energy Transfer
 * Melee, DMG(Energy), Foe Disorient, Self -HP, Special
 *
 * Source: scrapper_melee/energy_melee/energy_transfer.json
 */

import type { Power } from '@/types';

export const EnergyTransfer: Power = {
  "name": "Energy Transfer",
  "internalName": "Energy_Transfer",
  "available": 25,
  "description": "Mastery of Energy Melee culminates with the ability to transfer your own Hit Points into a punch that deals extreme damage. Energy Transfer has a good chance of Disorienting the target. This power will execute extremely quickly if under Energy Focus mode.",
  "shortHelp": "Melee, DMG(Energy), Foe Disorient, Self -HP, Special",
  "icon": "powerpunch_energytransfer.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 10,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
