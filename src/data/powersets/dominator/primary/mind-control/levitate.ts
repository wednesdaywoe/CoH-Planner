/**
 * Levitate
 * Ranged, Light DMG(Smash), Foe Knock Up
 *
 * Source: dominator_control/mind_control/levitate.json
 */

import type { Power } from '@/types';

export const Levitate: Power = {
  "name": "Levitate",
  "internalName": "Levitate",
  "available": 0,
  "description": "You can send a single target violently into the air, then slam them to the ground for Smashing damage. This power can bring flying foes to the ground. This power will affect enemies around your primary target, should it be used on the primary target of your Telekinesis.",
  "shortHelp": "Ranged, Light DMG(Smash), Foe Knock Up",
  "icon": "mentalcontrol_levitate.png",
  "powerType": "Click",
  "targetType": "Foe",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.87
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.32,
    "table": "Ranged_Damage"
  },
  "effects": {
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "knockup": {
      "scale": 6,
      "table": "Ranged_Knockback"
    }
  }
};
