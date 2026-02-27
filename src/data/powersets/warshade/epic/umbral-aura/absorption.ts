/**
 * Absorption
 * Auto: Self +Res (Energy,Negative)
 *
 * Source: warshade_defensive/umbral_aura/absorption.json
 */

import type { Power } from '@/types';

export const Absorption: Power = {
  "name": "Absorption",
  "available": 0,
  "description": "Kheldians have a natural mild resistance to Energy and Negative Energy damage. This Auto power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (Energy,Negative)",
  "icon": "umbralaura_absorption.png",
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
