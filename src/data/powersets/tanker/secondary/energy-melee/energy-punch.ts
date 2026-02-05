/**
 * Energy Punch
 * Melee, DMG(Smash/Energy), Foe Disorient
 *
 * Source: tanker_melee/energy_melee/energy_punch.json
 */

import type { Power } from '@/types';

export const EnergyPunch: Power = {
  "name": "Energy Punch",
  "internalName": "Energy_Punch",
  "available": 0,
  "description": "You perform a powerful Energy Punch that deals moderate damage. When used with other Energy Melee attacks, Energy Punch can Disorient your opponent.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Disorient",
  "icon": "powerpunch_energypunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.812,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.348,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.522,
      "table": "Melee_Damage"
    }
  ]
};
