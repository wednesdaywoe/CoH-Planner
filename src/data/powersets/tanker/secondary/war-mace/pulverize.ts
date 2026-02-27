/**
 * Pulverize
 * Melee, DMG(Smash), Disorient
 *
 * Source: tanker_melee/war_mace/pulverize.json
 */

import type { Power } from '@/types';

export const Pulverize: Power = {
  "name": "Pulverize",
  "internalName": "Pulverize",
  "available": 0,
  "description": "You attempt to Pulverize your opponent. This attack is slower than Bash but causes more damage. It also has a chance of Disorienting your opponent for a brief time.",
  "shortHelp": "Melee, DMG(Smash), Disorient",
  "icon": "mace_pulverize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.5
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
    "Melee Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
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
