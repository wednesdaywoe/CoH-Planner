/**
 * Crowd Control
 * Melee (Cone), Moderate DMG(Smashing), Knockback
 *
 * Source: brute_melee/war_mace/crowd_control.json
 */

import type { Power } from '@/types';

export const CrowdControl: Power = {
  "name": "Crowd Control",
  "internalName": "Crowd_Control",
  "available": 25,
  "description": "You swing your mace in a wide arc in front of you. This attack strikes all foes within melee range, deals them serious damage, and knocks them down.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Melee (Cone), Moderate DMG(Smashing), Knockback",
  "icon": "mace_crowdcontrol.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 8,
    "radius": 8,
    "arc": 3.1416,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.61,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.7245,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
