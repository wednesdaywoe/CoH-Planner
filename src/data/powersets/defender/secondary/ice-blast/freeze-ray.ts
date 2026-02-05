/**
 * Freeze Ray
 * Ranged, DMG(Cold), Foe Hold
 *
 * Source: defender_ranged/ice_blast/freeze_ray.json
 */

import type { Power } from '@/types';

export const FreezeRay: Power = {
  "name": "Freeze Ray",
  "internalName": "Freeze_Ray",
  "available": 15,
  "description": "Freeze Ray encases your foe in a block of ice, holding them helpless in place for a while. While frozen, your foe will take Cold damage over time.",
  "shortHelp": "Ranged, DMG(Cold), Foe Hold",
  "icon": "iceblast_freezeray.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1
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
    "Defender Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 2,
    "tickRate": 0.2
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Sleep"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    }
  }
};
