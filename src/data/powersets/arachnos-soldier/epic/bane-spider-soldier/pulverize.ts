/**
 * Pulverize
 * Melee, High DMG(Smash), Minor DoT(Toxic), Foe Disorient
 */

import type { Power } from '@/types';

export const Pulverize: Power = {
  "name": "Pulverize",
  "available": 11,
  "description": "You are capable of Pulverizing a foe with your Nullifier Mace dealing high damage and causing toxic damage over time. Pulverize will occasionally disorient foes as well. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: High",
  "shortHelp": "Melee, High DMG(Smash), Minor DoT(Toxic), Foe Disorient",
  "icon": "banespider_pulverize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Stun",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 8,
    "endurance": 11.48,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ]
};
