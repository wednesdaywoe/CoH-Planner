/**
 * Reach for the Limit
 * Self +DMG, +To Hit
 *
 * Source: blaster_support/martial_manipulation/build_up_proc.json
 */

import type { Power } from '@/types';

export const ReachfortheLimit: Power = {
  "name": "Reach for the Limit",
  "internalName": "Build_Up_Proc",
  "available": -1,
  "description": "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit.",
  "shortHelp": "Self +DMG, +To Hit",
  "icon": "martialmanipulation_reachforthelimit.png",
  "powerType": "Global Enhancement",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "activatePeriod": 10
  },
  "allowedEnhancements": [
    "Damage"
  ],
  "maxSlots": 6,
  "requires": "Blaster_Support.Martial_Manipulation.Reach_for_the_Limit"
};
