/**
 * Chilling Embrace
 * Toggle: PBAoE, Foe -Recharge, -Speed, -DMG
 *
 * Source: brute_defense/ice_armor/chilling_embrace.json
 */

import type { Power } from '@/types';

export const ChillingEmbrace: Power = {
  "name": "Chilling Embrace",
  "internalName": "Chilling_Embrace",
  "available": 3,
  "description": "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their movement speed and damage.",
  "shortHelp": "Toggle: PBAoE, Foe -Recharge, -Speed, -DMG",
  "icon": "icearmor_chillingembrace.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "Taunt",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Slow Movement",
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.7,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Dam"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Melee_SpeedRunning"
      }
    }
  }
};
