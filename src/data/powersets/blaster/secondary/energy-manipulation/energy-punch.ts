/**
 * Energy Punch
 * Melee, High DMG(Smash/Energy), Foe Disorient
 *
 * Source: blaster_support/energy_manipulation/energy_punch.json
 */

import type { Power } from '@/types';

export const EnergyPunch: Power = {
  "name": "Energy Punch",
  "internalName": "Energy_Punch",
  "available": 0,
  "description": "Powerful focused punch that may Disorient your opponent!Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Smash/Energy), Foe Disorient",
  "icon": "energymanipulation_energypunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
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
    "Blaster Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.96,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 5,
      "table": "Melee_Stun"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
