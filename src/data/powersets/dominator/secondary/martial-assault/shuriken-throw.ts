/**
 * Shuriken Throw
 * Ranged, Light DMG(Lethal)
 *
 * Source: dominator_assault/martial_assault/shuriken_throw.json
 */

import type { Power } from '@/types';

export const ShurikenThrow: Power = {
  "name": "Shuriken Throw",
  "internalName": "Shuriken_Throw",
  "available": 0,
  "description": "You impale your foe with a thrown shuriken, dealing moderate Lethal damage.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Lethal)",
  "icon": "martialassault_shurikenthrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1,
    "table": "Ranged_Damage"
  }
};
