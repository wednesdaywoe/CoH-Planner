/**
 * Frigid Shield
 * Toggle: +Absorb over time, Res(Slow)
 *
 * Source: sentinel_defense/ice_armor/frigid_shield.json
 */

import type { Power } from '@/types';

export const FrigidShield: Power = {
  "name": "Frigid Shield",
  "internalName": "Frigid_Shield",
  "available": 9,
  "description": "While active, you dramatically lower the temperature around yourself. The air around your body becomes so cold that attacks deflect off of it, granting you absorption.",
  "shortHelp": "Toggle: +Absorb over time, Res(Slow)",
  "icon": "icearmor_absorb.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 0.25,
      "table": "Melee_HealSelf"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 0.1,
        "table": "Melee_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.1,
      "table": "Melee_Ones"
    }
  }
};
