/**
 * Ice Arrow
 * Ranged, Foe Hold, -SPD, -Recharge, -DMG, -Special
 *
 * Source: controller_buff/trick_arrow/ice_arrow.json
 */

import type { Power } from '@/types';

export const IceArrow: Power = {
  "name": "Ice Arrow",
  "internalName": "Ice_Arrow",
  "available": 9,
  "description": "This arrow can freeze a single foe in a block of ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be Held, but all affected targets will be Slowed, have their secondary effects weakened, and damage output reduced.Recharge: Slow.",
  "shortHelp": "Ranged, Foe Hold, -SPD, -Recharge, -DMG, -Special",
  "icon": "trickarrow_hold.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 18,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "damageDebuff": {
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "durations": {
      "damageDebuff": 60,
      "absorb": 60,
      "enduranceDrain": 60,
      "slow": 60,
      "confuse": 60,
      "fear": 60,
      "hold": 60,
      "immobilize": 60,
      "stun": 60,
      "sleep": 60,
      "defenseDebuff": 60,
      "tohitDebuff": 60,
      "movement": 10,
      "rechargeDebuff": 10,
      "protection": 10
    },
    "absorb": {
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "enduranceDrain": {
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "slow": {
      "runSpeed": {
        "scale": 0.45,
        "table": "Ranged_Special"
      },
      "flySpeed": {
        "scale": 0.45,
        "table": "Ranged_Special"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "effectDuration": 60,
    "fear": {
      "mag": 1,
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "stun": {
      "mag": 1,
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "defenseDebuff": {
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "tohitDebuff": {
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    },
    "protection": {
      "knockup": 1,
      "knockback": 1
    },
    "buffDuration": 60
  }
};
