/**
 * Bitter Freeze Ray
 * Ranged, DMG(Cold), Foe Hold
 *
 * Source: defender_ranged/ice_blast/bitter_freeze_ray.json
 */

import type { Power } from '@/types';

export const BitterFreezeRay: Power = {
  "name": "Bitter Freeze Ray",
  "internalName": "Bitter_Freeze_Ray",
  "available": 27,
  "description": "This power can Hold your opponent frozen solid in a block of ice. The victim can be attacked and will remain frozen and helpless. After the ice thaws, the victim emerges chilled and Slowed.",
  "shortHelp": "Ranged, DMG(Cold), Foe Hold",
  "icon": "iceblast_bitterfreezeray.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.5
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
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
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 2.76,
    "table": "Ranged_Damage"
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "protection": {
      "knockup": 1,
      "knockback": 1
    },
    "durations": {
      "protection": 10,
      "knockup": 10,
      "knockback": 10
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "buffDuration": 10
  }
};
