/**
 * Incandescence
 * Auto: Self +Res (Energy, Negative)
 *
 * Source: peacebringer/luminous-aura
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
  "targetType": "Self"
};
