/**
 * Fortification
 * Toggle: Self +Res(Disorient, Hold, Immobilize, Sleep, All DMG but Psionics)
 *
 * Source: arachnos-soldier/crab-spider-training
 */

import type { Power } from '@/types';

export const Fortification: Power = {
  "name": "Fortification",
  "available": 23,
  "description": "Crab Spiders armor may be reinforced to become far more resistant to all types of damage except Psionics, as well as increasing protection to Sleep, Hold, Immobilization and Disorient effects.",
  "shortHelp": "Toggle: Self +Res(Disorient, Hold, Immobilize, Sleep, All DMG but Psionics)",
  "icon": "crabspidertraining_fortification.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 3,
    "endurance": 0.104,
    "castTime": 2.33
  },
  "targetType": "Self"
};
