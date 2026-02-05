/**
 * Choking Powder
 * Ranged, Moderate DoT(Toxic), Foe Hold
 *
 * Source: blaster_support/ninja_training/choking_powder.json
 */

import type { Power } from '@/types';

export const ChokingPowder: Power = {
  "name": "Choking Powder",
  "internalName": "Choking_Powder",
  "available": 3,
  "description": "Toss a fistful of toxic powder at an enemy’s face. This powder will temporarily close the affected foe’s throat making them choke and struggle to grasp for air.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged, Moderate DoT(Toxic), Foe Hold",
  "icon": "ninjatools_hold.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "recharge": 16,
    "endurance": 11.388,
    "castTime": 1.07
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
    "type": "Toxic",
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
