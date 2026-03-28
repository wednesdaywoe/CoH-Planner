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
    "absorb": {
      "scale": 0.45,
      "table": "Ranged_Special"
    },
    "durations": {
      "absorb": 60,
      "enduranceDrain": 60,
      "confuse": 60,
      "fear": 60,
      "hold": 60,
      "immobilize": 60,
      "stun": 60,
      "sleep": 60,
      "defenseDebuff": 60,
      "mezResistance": 10
    },
    "enduranceDrain": {
      "scale": 0.45,
      "table": "Ranged_Special"
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
    "mezResistance": {
      "knockup": {
        "scale": 100,
        "table": "Ranged_Ones"
      },
      "knockback": {
        "scale": 100,
        "table": "Ranged_Ones"
      }
    },
    "buffDuration": 60
  }
};
