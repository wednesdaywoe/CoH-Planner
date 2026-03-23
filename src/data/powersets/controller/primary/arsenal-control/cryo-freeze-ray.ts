/**
 * Cryo Freeze Ray
 * Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge, -Fly
 *
 * Source: controller_control/arsenal_control/cryo_freeze_ray.json
 */

import type { Power } from '@/types';

export const CryoFreezeRay: Power = {
  "name": "Cryo Freeze Ray",
  "internalName": "Cryo_Freeze_Ray",
  "available": 0,
  "description": "The Cryo Freeze Ray encases your foe in a block of ice, holding him helpless in place for a while and dealing some cold damage.",
  "shortHelp": "Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge, -Fly",
  "icon": "arsenalcontrol_beanbag.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.25,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
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
    "Controller Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "protection": {
      "knockup": 1,
      "knockback": 1
    },
    "durations": {
      "protection": 12
    },
    "buffDuration": 12
  }
};
