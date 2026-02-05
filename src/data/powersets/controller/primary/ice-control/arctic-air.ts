/**
 * Arctic Air
 * Toggle: PBAoE, Foe Confuse(Special), -SPD, -Recharge, -Stealth
 *
 * Source: controller_control/ice_control/artic_air.json
 */

import type { Power } from '@/types';

export const ArcticAir: Power = {
  "name": "Arctic Air",
  "internalName": "Artic_Air",
  "available": 5,
  "description": "While this power is active, you are surrounded in a fog of Arctic Air that dramatically slows the attack and movement speed of nearby foes. The chill of Arctic Air is so bitter that many foes are forced to flee, albeit very slowly, from the immediate area. Others may attack their own allies, as the fog from the Arctic Air is thick and can cause much confusion. The cold air can also reduced the stealth capability of affected foes.",
  "shortHelp": "Toggle: PBAoE, Foe Confuse(Special), -SPD, -Recharge, -Stealth",
  "icon": "iceformation_articair.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 15,
    "endurance": 2.08,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Confuse"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Controller Archetype Sets",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    },
    "movement": {
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
      },
      "jumpHeight": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      }
    },
    "stealth": {
      "stealthPvE": {
        "scale": 35,
        "table": "Ranged_Ones"
      },
      "stealthPvP": {
        "scale": 389,
        "table": "Ranged_Ones"
      }
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    },
    "fear": {
      "mag": 1,
      "scale": 3,
      "table": "Ranged_Ones"
    },
    "effectDuration": 2
  }
};
