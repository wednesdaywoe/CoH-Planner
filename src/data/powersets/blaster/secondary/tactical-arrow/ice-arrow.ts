/**
 * Ice Arrow
 * Ranged, DoT(Cold), Foe Hold, -SPD, -Recharge
 *
 * Source: blaster_support/tactical_arrow/ice_arrow.json
 */

import type { Power } from '@/types';

export const IceArrow: Power = {
  "name": "Ice Arrow",
  "internalName": "Ice_Arrow",
  "available": 3,
  "description": "This arrow can freeze a single foe in a block of ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be Held, but all affected targets will be Slowed.Damage: Minor.Recharge: Slow.",
  "shortHelp": "Ranged, DoT(Cold), Foe Hold, -SPD, -Recharge",
  "icon": "tacticalarrow_hold.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 16,
    "endurance": 11.388,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.05,
    "table": "Ranged_Damage",
    "duration": 4.2,
    "tickRate": 0.5
  },
  "effects": {
    "hold": {
      "mag": 2,
      "scale": 10,
      "table": "Ranged_Immobilize"
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
      "scale": 0.1,
      "table": "Ranged_Slow"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
