/**
 * Electron Shackles
 * Ranged, DoT(Energy), Foe Immobilize, -DEF, +Negatrons
 *
 * Source: blaster_support/radiation_manipulation/electron_shackles.json
 */

import type { Power } from '@/types';

export const ElectronShackles: Power = {
  "name": "Electron Shackles",
  "internalName": "Electron_Shackles",
  "available": 0,
  "description": "Immobilizes a single target and deals some energy damage over time. Some more resilient foes may require multiple attacks to Immobilize. Electron Shackles can also reduce a target's Defense and will surround it in negatively charged particles. Hitting a foe that has positive charged particles will trigger a Gamma Burst.",
  "shortHelp": "Ranged, DoT(Energy), Foe Immobilize, -DEF, +Negatrons",
  "icon": "atomicmanipulation_immob.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
