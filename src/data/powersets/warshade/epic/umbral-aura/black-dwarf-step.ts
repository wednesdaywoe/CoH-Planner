/**
 * Black Dwarf Step
 * Ranged (Location), Self Teleport
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const BlackDwarfStep: Power = {
  "name": "Black Dwarf Step",
  "available": 19,
  "description": "Black Dwarfs can Teleport long distances. Black Dwarf Step has no recharge time, and can be reactivated without pause, as long as you have Endurance.",
  "shortHelp": "Ranged (Location), Self Teleport",
  "icon": "umbralaura_teleportself.png",
  "powerType": "Click",
  "effectArea": "Location",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range"
  ],
  "allowedSetCategories": [
    "Teleport",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "range": 300,
    "endurance": 13,
    "castTime": 1.67
  },
  "targetType": "Location (Teleport)",
  "requires": "Black Dwarf"
};
