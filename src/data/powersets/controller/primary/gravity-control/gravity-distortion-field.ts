/**
 * Gravity Distortion Field
 * Ranged (Targeted AoE), Foe Hold, Damage(Smashing), +Gravity Distortion
 *
 * Source: controller_control/gravity_control/gravity_distortion_field.json
 */

import type { Power } from '@/types';

export const GravityDistortionField: Power = {
  "name": "Gravity Distortion Field",
  "internalName": "Gravity_Distortion_Field",
  "available": 17,
  "description": "Creates a large, intensely misshapen Gravity Distortion Field that encompasses several foes, rendering them unable to take any action. Enemies in the area of effect will be affected by the Gravity Distortion effect.",
  "shortHelp": "Ranged (Targeted AoE), Foe Hold, Damage(Smashing), +Gravity Distortion",
  "icon": "gravitycontrol_gravitydistortion.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "recharge": 240,
    "endurance": 15.6,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Gravity Distortion Field",
      "powers": [
        "Redirects.Gravity_Control.Gravity_Distortion_Field_Pulse",
        "Redirects.Gravity_Control.Gravity_Distortion_Field_Slow",
        "Redirects.Gravity_Control.Gravity_Distortion_Field_Oneshot",
        "Redirects.Gravity_Control.Self_Destruct"
      ]
    }
  }
};
