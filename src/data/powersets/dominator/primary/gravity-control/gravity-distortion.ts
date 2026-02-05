/**
 * Gravity Distortion
 * Ranged, DoT(Smash), Foe Hold, -Fly, +Gravity Distortion
 *
 * Source: dominator_control/gravity_control/gravity_distortion.json
 */

import type { Power } from '@/types';

export const GravityDistortion: Power = {
  "name": "Gravity Distortion",
  "internalName": "Gravity_Distortion",
  "available": 1,
  "description": "Causes a single foe to be trapped in a misshapen gravity field, rendering him unable to take action. Gravity Distortion applies the Gravity Distortion effect and deals Smashing damage to the target.",
  "shortHelp": "Ranged, DoT(Smash), Foe Hold, -Fly, +Gravity Distortion",
  "icon": "gravitycontrol_gravitydistortion.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.22,
    "table": "Ranged_Damage",
    "duration": 4.2,
    "tickRate": 1
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
