/**
 * Barrier Reef
 * Summon Barrier Reef: Team +Absorb, +DEF(All)
 *
 * Source: mastermind_buff/marine_affinity/wellspring.json
 */

import type { Power } from '@/types';

export const BarrierReef: Power = {
  "name": "Barrier Reef",
  "internalName": "Wellspring",
  "available": 27,
  "description": "Create a Barrier Reef teeming with life at your target location. The Barrier Reef will emit an aura that washes over allies in range, providing them with a defensive cover of water that will absorb and deflect some damage.",
  "shortHelp": "Summon Barrier Reef: Team +Absorb, +DEF(All)",
  "icon": "marineaffinity_wellspring.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 30,
    "endurance": 16.9,
    "castTime": 2.37
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Wellspring",
      "duration": 240
    }
  }
};
