/**
 * Quicksand
 * Ranged (Location AoE), Foe -Speed, -Jump, -Fly, -DEF
 *
 * Source: dominator_control/earth_control/quicksand.json
 */

import type { Power } from '@/types';

export const Quicksand: Power = {
  "name": "Quicksand",
  "internalName": "Quicksand",
  "available": 5,
  "description": "You can cause the ground to liquefy like Quicksand at a targeted location. Any foes that pass through the Quicksand will become snared, their movement will be dramatically Slowed, and their Defense reduced. Foes trapped in the Quicksand cannot jump or Fly.",
  "shortHelp": "Ranged (Location AoE), Foe -Speed, -Jump, -Fly, -DEF",
  "icon": "earthgrasp_quicksand.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 90,
    "recharge": 30,
    "endurance": 7.8,
    "castTime": 3.1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Quicksand",
      "duration": 45
    }
  }
};
