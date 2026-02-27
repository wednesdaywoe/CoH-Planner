/**
 * Propel
 * Ranged, DMG(Smash), Foe Knockback
 *
 * Source: dominator_control/gravity_control/propel.json
 */

import type { Power } from '@/types';

export const Propel: Power = {
  "name": "Propel",
  "internalName": "Propel",
  "available": 5,
  "description": "You can open a gravitational rift and retrieve a heavy object, then Propel it at your foes for Smashing Damage. This power can deal bonus damage when used against targets under the effects of Gravity Distortion. This attack's force is so strong that it can knockback additional nearby enemies.",
  "shortHelp": "Ranged, DMG(Smash), Foe Knockback",
  "icon": "gravitycontrol_propel.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 15,
    "recharge": 8,
    "endurance": 9.36,
    "castTime": 2.07,
    "maxTargets": 4
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
      "scale": 1.96,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.49,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    }
  }
};
