/**
 * Power Crash
 * Melee (Cone), DMG(Smash/Energy), Foe Disorient, Special
 *
 * Source: scrapper_melee/energy_melee/power_crash.json
 */

import type { Power } from '@/types';

export const PowerCrash: Power = {
  "name": "Power Crash",
  "internalName": "Power_Crash",
  "available": 7,
  "description": "You focus your internal energy on your fists and release it once you hit your target unleashing an energy wave that hurts and disorients multiple enemies. This power will hit up to 5 additional foes if used while in Energy Focus mode.",
  "shortHelp": "Melee (Cone), DMG(Smash/Energy), Foe Disorient, Special",
  "icon": "powerpunch_powercrash.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 10,
    "arc": 2.0944,
    "recharge": 9,
    "endurance": 9.36,
    "castTime": 1.8,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.5054,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.6978,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.5415,
      "table": "Melee_Damage"
    }
  ]
};
