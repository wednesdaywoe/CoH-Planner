/**
 * Cremate
 * Melee, DMG(Fire), Knockup
 *
 * Source: stalker_melee/fiery_melee/cremate.json
 */

import type { Power } from '@/types';

export const Cremate: Power = {
  "name": "Cremate",
  "internalName": "Cremate",
  "available": 1,
  "description": "A slow but devastating attack. Cremate clobbers your foes with a massive 2 handed fiery smash knocks down and leaves your foe on fire.",
  "shortHelp": "Melee, DMG(Fire), Knockup",
  "icon": "fieryfray_scorch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 1.6,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "knockup": {
      "scale": 0.75,
      "table": "Melee_Ones"
    }
  }
};
