/**
 * Snap Shot
 * Ranged, DMG(Lethal)
 *
 * Source: blaster_ranged/archery/snap_shot.json
 */

import type { Power } from '@/types';

export const SnapShot: Power = {
  "name": "Snap Shot",
  "internalName": "Snap_Shot",
  "available": 0,
  "description": "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.",
  "shortHelp": "Ranged, DMG(Lethal)",
  "icon": "archery_quickarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 80,
    "recharge": 2,
    "endurance": 3.536,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.84,
    "table": "Ranged_Damage"
  },
  "effects": {
    "damageBuff": {
      "scale": 0.066,
      "table": "Ranged_Ones"
    }
  }
};
