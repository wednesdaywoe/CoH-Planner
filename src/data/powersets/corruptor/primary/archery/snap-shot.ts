/**
 * Snap Shot
 * Ranged, Moderate DMG(Lethal)
 *
 * Source: corruptor_ranged/archery/snap_shot.json
 */

import type { Power } from '@/types';

export const SnapShot: Power = {
  "name": "Snap Shot",
  "internalName": "Snap_Shot",
  "available": 0,
  "description": "A quick attack that fires an arrow at your foe after only minimal aiming. Fast, but little damage.Damage: Moderate.Recharge: Very Fast.",
  "shortHelp": "Ranged, Moderate DMG(Lethal)",
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
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.68,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.68,
      "table": "Ranged_InherentDamage"
    }
  ]
};
