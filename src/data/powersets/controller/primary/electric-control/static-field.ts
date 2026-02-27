/**
 * Static Field
 * Target (Location AoE), Foe Sleep, -End
 *
 * Source: controller_control/electric_control/static_field.json
 */

import type { Power } from '@/types';

export const StaticField: Power = {
  "name": "Static Field",
  "internalName": "Static_Field",
  "available": 11,
  "description": "You can build up a Static Field at a nearby location. Any foes in the field may lose control of their muscles due to the static charge, and will shake violently. Foes may also be drained of some endurance, and some of that endurance may be transferred to nearby allies. Any attack will interrupt the effect temporarily and foes will re-gain control, although their movement and attack rates will be reduced. This effect can last for some time, and will continue to paralyze foes in the field.",
  "shortHelp": "Target (Location AoE), Foe Sleep, -End",
  "icon": "electriccontrol_staticfield.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 40,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Endurance Modification",
    "Sleep",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Static Field",
      "powers": [
        "Pets.Static_Field_Controller.Static_Field"
      ],
      "duration": 25,
      "copyBoosts": true
    }
  }
};
