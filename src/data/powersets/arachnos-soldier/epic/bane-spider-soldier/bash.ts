/**
 * Bash
 * Melee, Moderate DMG(Smash), Minor DoT(Toxic), Foe Disorient
 */

import type { Power } from '@/types';

export const Bash: Power = {
  "name": "Bash",
  "available": 0,
  "description": "Bash with your Nullifier Mace dealing moderate Smashing damage and minor Toxic damage over time. Has a chance to disorient the target. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: Moderate",
  "shortHelp": "Melee, Moderate DMG(Smash), Minor DoT(Toxic), Foe Disorient",
  "icon": "banespider_bash.png",
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
    "recharge": 4,
    "endurance": 7,
    "castTime": 1.33
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ]
};
