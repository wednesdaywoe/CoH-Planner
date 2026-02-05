/**
 * Group Energy Flight
 * Toggle: Team Fly
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const GroupEnergyFlight: Power = {
  "name": "Group Energy Flight",
  "available": 15,
  "description": "You can endow your nearby teammates with Flight. Be mindful! Your friends will fall if you run out of Endurance or if they travel too far away from you. Group Energy Flight travel speed is slower than Energy Flight.",
  "shortHelp": "Toggle: Team Fly",
  "icon": "luminousaura_groupenergyflight.png",
  "powerType": "Toggle",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Fly"
  ],
  "allowedSetCategories": [
    "Flight",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "endurance": 1.3,
    "castTime": 2.03,
    "radius": 60,
    "maxTargets": 255
  },
  "targetType": "Self"
};
