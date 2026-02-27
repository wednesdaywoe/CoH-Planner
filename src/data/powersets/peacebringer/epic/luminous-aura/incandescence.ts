/**
 * Incandescence
 * Auto: Self +Res (Energy, Negative)
 *
 * Source: peacebringer_defensive/luminous_aura/incandescence.json
 */

import type { Power } from '@/types';

export const Incandescence: Power = {
  "name": "Incandescence",
  "available": 0,
  "description": "Kheldians have a natural mild resistance to Energy and Negative Energy damage. This Auto power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (Energy, Negative)",
  "icon": "luminousaura_incandescence.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "energy": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
