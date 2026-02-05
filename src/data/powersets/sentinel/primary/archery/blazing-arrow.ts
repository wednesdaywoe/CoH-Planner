/**
 * Blazing Arrow
 * Ranged, Superior DMG(Lethal), Minor DoT(Fire)
 *
 * Source: sentinel_ranged/archery/blazing_arrow.json
 */

import type { Power } from '@/types';

export const BlazingArrow: Power = {
  "name": "Blazing Arrow",
  "internalName": "Blazing_Arrow",
  "available": 17,
  "description": "You fire a Blazing Arrow at your foe, dealing some Lethal damage and causing them to catch on fire and burn.Damage: Superior.Recharge: Moderate.",
  "shortHelp": "Ranged, Superior DMG(Lethal), Minor DoT(Fire)",
  "icon": "archery_flamingarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 60,
    "recharge": 10,
    "endurance": 10.19,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.96,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.125,
      "table": "Ranged_Damage",
      "duration": 4.125,
      "tickRate": 1
    }
  ]
};
