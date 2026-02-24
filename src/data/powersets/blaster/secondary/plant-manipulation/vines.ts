/**
 * Vines
 * Ranged (Targeted AoE), Foe Hold, Immobilize
 *
 * Source: blaster_support/plant_manipulation/vines.json
 */

import type { Power } from '@/types';

export const Vines: Power = {
  "name": "Vines",
  "internalName": "Vines",
  "available": 27,
  "description": "Creates a field of Strangler Vines that can Hold multiple foes at range. The affected targets are held helpless by the massive root-like vines. Some are likely to free their arms and attack, but will still be unable to move. Unlike the power Strangler, this power does not deal any damage, but it can Hold multiple foes at once.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Foe Hold, Immobilize",
  "icon": "plantmanipulation_vines.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "radius": 15,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Immobilize"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    },
    "hold": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    }
  }
};
