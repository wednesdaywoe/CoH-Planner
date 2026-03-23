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
      "scale": 0.5,
      "table": "Melee_HealSelf"
    },
    "durations": {
      "absorb": 20,
      "debuffResistance": 4
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
    "buffDuration": 20
  }
};
