/**
 * Shadow Field
 * Target (Location AoE), Foe Hold, -To Hit
 *
 * Source: controller_control/darkness_control/shadow_field.json
 */

import type { Power } from '@/types';

export const ShadowField: Power = {
  "name": "Shadow Field",
  "internalName": "Shadow_Field",
  "available": 21,
  "description": "You blanket a targeted area in darkness immediately holding foes within the field. Any foe who enters this area will have their chance to hit reduced and has a chance to be held for a short period of time.Recharge: Long.",
  "shortHelp": "Target (Location AoE), Foe Hold, -To Hit",
  "icon": "darknesscontrol_shadowfield.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 15.6,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Controller Archetype Sets",
    "Holds",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Shadow_Field_Controller",
      "duration": 45
    }
  }
};
