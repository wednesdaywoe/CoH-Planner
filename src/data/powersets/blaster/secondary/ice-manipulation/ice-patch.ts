/**
 * Ice Patch
 * Location (PBAoE), Foe Knockdown
 *
 * Source: blaster_support/ice_manipulation/ice_patch.json
 */

import type { Power } from '@/types';

export const IcePatch: Power = {
  "name": "Ice Patch",
  "internalName": "Ice_Patch",
  "available": 19,
  "description": "You emanate a patch of ice around you, which causes foes that step onto it to slip and fall down. This effect lasts until the ice melts. You must be near the ground to activate this power.Recharge: Slow.",
  "shortHelp": "Location (PBAoE), Foe Knockdown",
  "icon": "icemanipulation_icepatch.png",
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
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
