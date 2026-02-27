/**
 * Dimension Shift
 * Toggle, Ranged (Location AoE), Foe Intangible
 *
 * Source: controller_control/gravity_control/dimension_shift.json
 */

import type { Power } from '@/types';

export const DimensionShift: Power = {
  "name": "Dimension Shift",
  "internalName": "Dimension_Shift",
  "available": 11,
  "description": "Location-targeted AoE toggle. This power folds space in an area, immobilizing and phasing all targets within the sphere. Enemies who enter the area become immobilized and phased for the duration of the effect. Allies who enter the sphere's area of effect will enter the phase as well, allowing them to combat phased enemies. Detoggling this power ends the effect, bringing the phased creatures back into the physical world. Maintaining this dimensional distortion is taxing on the user, and cannot be done for more than 20 seconds.",
  "shortHelp": "Toggle, Ranged (Location AoE), Foe Intangible",
  "icon": "gravitycontrol_dimensionshift2.png",
  "powerType": "Toggle",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 60,
    "endurance": 15.6,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Immobilize"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Dimension_Shift_Phased",
      "duration": 20
    }
  }
};
