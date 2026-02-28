/**
 * Crowd Control
 * Melee(Cone), High DMG(Smash), Minor DoT(Toxic), Foe Knockback
 */

import type { Power } from '@/types';

export const CrowdControl: Power = {
  "name": "Crowd Control",
  "available": 25,
  "description": "Swing your Nullifier Mace in a wide arc in front of you. This attack strikes all foes within melee range, deals them high damage and minor Toxic damage over time, and knocks them down. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: High",
  "shortHelp": "Melee(Cone), High DMG(Smash), Minor DoT(Toxic), Foe Knockback",
  "icon": "banespider_crowdcontrol.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2,
    "arc": 120,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.1,
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
