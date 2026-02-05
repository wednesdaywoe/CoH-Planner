/**
 * Strangler
 * Ranged, DoT(Smash), Foe Hold
 *
 * Source: blaster_support/plant_manipulation/strangler.json
 */

import type { Power } from '@/types';

export const Strangler: Power = {
  "name": "Strangler",
  "internalName": "Strangler",
  "available": 3,
  "description": "Holds a distant foe by Strangling him with massive root-like vines. The target is held helpless, while he is slowly crushed by the vines.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Ranged, DoT(Smash), Foe Hold",
  "icon": "plantmanipulation_strangler.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 16,
    "endurance": 11.388,
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
    "Blaster Archetype Sets",
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
      "mag": 2,
      "scale": 10,
      "table": "Ranged_Immobilize"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
