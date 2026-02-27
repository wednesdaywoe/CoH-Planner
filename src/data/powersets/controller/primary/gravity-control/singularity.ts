/**
 * Singularity
 * Summon Singularity: Ranged Control Special
 *
 * Source: controller_control/gravity_control/fold_space.json
 */

import type { Power } from '@/types';

export const Singularity: Power = {
  "name": "Singularity",
  "internalName": "Fold_Space",
  "available": 25,
  "description": "You can create a very powerful Gravitational Singularity. The Singularity will engage your foes, assaulting them with various gravity powers. Any foes that attempt to approach the Singularity will be violently hurled away. The Singularity cannot be healed, but is highly resistant to all forms of damage and nearly impervious to Controlling type powers. Type ''/release_pets'' in the chat window to release all your pets.",
  "shortHelp": "Summon Singularity: Ranged Control Special",
  "icon": "gravitycontrol_singularity.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 20.8,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Knockback",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Singularity_Controller"
    }
  }
};
