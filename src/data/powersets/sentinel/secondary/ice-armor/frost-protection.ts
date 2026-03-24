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
    "recharge": 10,
    "activatePeriod": 10
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
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    "durations": {
      "maxHPBuff": 10.3,
      "debuffResistance": 10.3
    },
    "debuffResistance": {
      "movement": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "recharge": {
        "scale": 0.1,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 10.3
  }
};
