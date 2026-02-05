/**
 * Flashfire
 * Ranged (Targeted AoE), Minor DMG(Fire), Foe Disorient
 *
 * Source: controller_control/fire_control/flashfire.json
 */

import type { Power } from '@/types';

export const Flashfire: Power = {
  "name": "Flashfire",
  "internalName": "Flashfire",
  "available": 11,
  "description": "You can bring forth a Flashfire to Disorient a group of foes and deal some damage over time. Target must be on the ground to activate Flashfire.",
  "shortHelp": "Ranged (Targeted AoE), Minor DMG(Fire), Foe Disorient",
  "icon": "firetrap_flashfire.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 25,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.37,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.06,
      "table": "Ranged_Damage",
      "duration": 4,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.06,
      "table": "Ranged_InherentDamage",
      "duration": 4,
      "tickRate": 1
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
