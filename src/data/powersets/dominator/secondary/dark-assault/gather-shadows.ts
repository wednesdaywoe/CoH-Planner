/**
 * Gather Shadows
 * Self +Special, +Dmg(All)
 *
 * Source: dominator_assault/dark_assault/gather_shadows.json
 */

import type { Power } from '@/types';

export const GatherShadows: Power = {
  "name": "Gather Shadows",
  "internalName": "Gather_Shadows",
  "available": 15,
  "description": "By collecting shadows from your surroundings you boost your damage and the secondary effects of your powers. Your powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all improved. The effects of Gather Shadows last a short while, and only the next couple of attacks will be boosted.Recharge: Long.",
  "shortHelp": "Self +Special, +Dmg(All)",
  "icon": "darknessassault_gathershadows.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
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
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "absorb": {
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "enduranceGain": {
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_Stun"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Melee_Stun"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "effectDuration": 10,
    "fear": {
      "mag": 1,
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "hold": {
      "mag": 1,
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "stun": {
      "mag": 1,
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "defenseBuff": {
      "scale": 0.5,
      "table": "Melee_Stun"
    },
    "tohitBuff": {
      "scale": 0.5,
      "table": "Melee_Stun"
    }
  }
};
