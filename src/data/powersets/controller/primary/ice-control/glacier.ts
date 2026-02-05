/**
 * Glacier
 * PBAoE, Foe Hold, -Recharge, -SPD
 *
 * Source: controller_control/ice_control/glacier.json
 */

import type { Power } from '@/types';

export const Glacier: Power = {
  "name": "Glacier",
  "internalName": "Glacier",
  "available": 21,
  "description": "You can freeze all foes around yourself in blocks of Glacial ice. The targets are frozen solid, helpless, and can be attacked. Even after the victims emerge, they remain chilled and their attack and movement speed is Slowed for a while. This power can only be cast near the ground.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "PBAoE, Foe Hold, -Recharge, -SPD",
  "icon": "iceformation_glacier.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 30,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
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
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    }
  }
};
