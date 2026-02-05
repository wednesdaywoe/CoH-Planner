/**
 * Power Boost
 * Self +Special
 *
 * Source: blaster_support/energy_manipulation/power_boost.json
 */

import type { Power } from '@/types';

export const PowerBoost: Power = {
  "name": "Power Boost",
  "internalName": "Power_Boost",
  "available": 23,
  "description": "Greatly boosts the secondary effects of your powers. Your powers effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all improved. The effects of Power Boost last a short while, and only the next couple of attacks will be boosted.Recharge: Slow.",
  "shortHelp": "Self +Special",
  "icon": "energymanipulation_powerboost.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 7.8,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "absorb": {
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "enduranceGain": {
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.66,
        "table": "Melee_Stun"
      },
      "flySpeed": {
        "scale": 0.66,
        "table": "Melee_Stun"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "effectDuration": 15,
    "fear": {
      "mag": 1,
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "hold": {
      "mag": 1,
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "stun": {
      "mag": 1,
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "defenseBuff": {
      "scale": 0.66,
      "table": "Melee_Stun"
    },
    "tohitBuff": {
      "scale": 0.66,
      "table": "Melee_Stun"
    }
  }
};
