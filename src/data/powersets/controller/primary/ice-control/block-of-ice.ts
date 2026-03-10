/**
 * Block of Ice
 * Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge
 *
 * Source: controller_control/ice_control/block_of_ice.json
 */

import type { Power } from '@/types';

export const BlockofIce: Power = {
  "name": "Block of Ice",
  "internalName": "Block_of_Ice",
  "available": 0,
  "description": "You can freeze a single foe in a Block of Ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be held, but all affected targets will be Slowed and take some Cold damage.",
  "shortHelp": "Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge",
  "icon": "iceformation_blockofice.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.87
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
    "Controller Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "protection": {
      "knockup": 1,
      "knockback": 1
    },
    "buffDuration": 12,
    "durations": {
      "movement": 12,
      "protection": 12,
      "rechargeBuff": 12
    }
  }
};
