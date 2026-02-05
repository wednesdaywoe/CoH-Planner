/**
 * Frost Protection
 * Auto: +HP, Res (Slow)
 *
 * Source: sentinel_defense/ice_armor/frost_protection.json
 */

import type { Power } from '@/types';

export const FrostProtection: Power = {
  "name": "Frost Protection",
  "internalName": "Frost_Protection",
  "available": 27,
  "description": "The lower temperature of your body makes you sturdier to damage increasing your maximum HP. You also become resistant to slow debuffs.",
  "shortHelp": "Auto: +HP, Res (Slow)",
  "icon": "icearmor_hp.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10
  },
  "allowedEnhancements": [
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 0.5,
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
