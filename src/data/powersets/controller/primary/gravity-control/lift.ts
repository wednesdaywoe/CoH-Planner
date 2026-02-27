/**
 * Lift
 * Ranged, DMG(Smash)
 *
 * Source: controller_control/gravity_control/lift.json
 */

import type { Power } from '@/types';

export const Lift: Power = {
  "name": "Lift",
  "internalName": "Lift",
  "available": 0,
  "description": "Negates the gravity around a single target. Lift violently sends an enemy straight into the air, then slams them to the ground for Smashing damage. This power can bring flying foes to the ground, and can deal bonus damage when used against targets under the effects of Gravity Distortion.",
  "shortHelp": "Ranged, DMG(Smash)",
  "icon": "gravitycontrol_lift.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.03
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
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.32,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1.32,
      "table": "Ranged_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 0.33,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockup": {
      "scale": 6,
      "table": "Ranged_Knockback"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
