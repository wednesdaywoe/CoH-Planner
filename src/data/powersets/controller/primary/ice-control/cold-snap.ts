/**
 * Cold Snap
 * Ranged (Cone), Foe Fear, -SPD, -Recharge
 *
 * Source: controller_control/ice_control/shiver.json
 */

import type { Power } from '@/types';

export const ColdSnap: Power = {
  "name": "Cold Snap",
  "internalName": "Shiver",
  "available": 7,
  "description": "You blast forth a wide cone of chilling air that dramatically slows the enemies' movement and attack rate and might leave nearby foes trembling.Notes: The Fear component applies only to enemies in the center area of effect.",
  "shortHelp": "Ranged (Cone), Foe Fear, -SPD, -Recharge",
  "icon": "iceformation_shiver.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 2.3562,
    "recharge": 40,
    "endurance": 10.4,
    "castTime": 2.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Fear",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.65,
      "table": "Ranged_Slow"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    }
  }
};
