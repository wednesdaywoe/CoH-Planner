/**
 * Deceive
 * Ranged, Foe Confuse
 *
 * Source: dominator_control/illusion_control/deceive.json
 */

import type { Power } from '@/types';

export const Deceive: Power = {
  "name": "Deceive",
  "internalName": "Deceive",
  "available": 1,
  "description": "You can Deceive an enemy into believing their friends are not who they appear to be. If successful, the enemy will ignore you and attack their own allies. If you Deceive someone before they have noticed you, your presence will continue to be masked. Damage done by a Deceived enemy will reduce the total amount of Experience Points awarded when a foe is defeated.",
  "shortHelp": "Ranged, Foe Confuse",
  "icon": "illusions_decieve.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Dominator Archetype Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 20,
      "table": "Ranged_Immobilize"
    }
  }
};
