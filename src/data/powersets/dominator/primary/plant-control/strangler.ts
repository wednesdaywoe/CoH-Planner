/**
 * Strangler
 * Ranged, DoT(Smashing), Foe Hold
 *
 * Source: dominator_control/plant_control/strangler.json
 */

import type { Power } from '@/types';

export const Strangler: Power = {
  "name": "Strangler",
  "internalName": "Strangler",
  "available": 0,
  "description": "Holds a distant foe by Strangling him with massive root-like vines. The target is held helpless, while he is slowly crushed by the vines.",
  "shortHelp": "Ranged, DoT(Smashing), Foe Hold",
  "icon": "plantcontrol_strangler.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "Hold",
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
    }
  }
};
