/**
 * Energy Punch
 * Melee, DMG(Smash/Energy), Foe Disorient
 *
 * Source: brute_melee/energy_melee/energy_punch.json
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
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Stuns",
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
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 5,
      "table": "Melee_Stun"
    }
  }
};
