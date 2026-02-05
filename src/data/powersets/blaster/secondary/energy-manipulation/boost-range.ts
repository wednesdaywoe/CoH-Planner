/**
 * Boost Range
 * Self Range Increase
 *
 * Source: blaster_support/energy_manipulation/boost_range.json
 */

import type { Power } from '@/types';

export const BoostRange: Power = {
  "name": "Boost Range",
  "internalName": "Range",
  "available": 27,
  "description": "You can boost your powers to increase the range of your next few attacks.Recharge: Slow.",
  "shortHelp": "Self Range Increase",
  "icon": "energymanipulation_boostrange.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 13,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "rangeBuff": {
      "scale": 0.5,
      "table": "Melee_Stun"
    }
  }
};
