/**
 * Ice Patch
 * Location (PBAoE), Foe Knockdown
 *
 * Source: brute_melee/ice_melee/ice_patch.json
 */

import type { Power } from '@/types';

export const IcePatch: Power = {
  "name": "Ice Patch",
  "internalName": "Ice_Patch",
  "available": 7,
  "description": "You emanate a Patch of Ice around you. Foes that step onto the Ice Patch will slip and fall down. This effect lasts until the ice melts. You must be near the ground to activate this power.",
  "shortHelp": "Location (PBAoE), Foe Knockdown",
  "icon": "icyonslaught_icepatch.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 2,
    "recharge": 35,
    "endurance": 10.4,
    "castTime": 1.57
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_IcePatch",
      "duration": 30
    }
  }
};
