/**
 * Mud Bath
 * Toggle: PBAoE, -SPD, Self +Heal Over Time, +Recovery
 *
 * Source: blaster_support/earth_manipulation/mud_bath.json
 */

import type { Power } from '@/types';

export const MudBath: Power = {
  "name": "Mud Bath",
  "internalName": "Mud_Bath",
  "available": 19,
  "description": "While this power is active, you draw upon the geothermal power of the Earth to create a bubbling pool of hot mud around you. All foes in melee range will become snared and entrapped in the mud, slowing them down. You recover a small amount of health every few seconds while this power is active.Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE, -SPD, Self +Heal Over Time, +Recovery",
  "icon": "earthmanip_mudbath.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 4,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Melee_Slow"
      }
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Melee_SpeedRunning"
      }
    }
  }
};
