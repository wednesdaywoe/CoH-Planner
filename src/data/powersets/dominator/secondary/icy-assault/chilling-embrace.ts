/**
 * Chilling Embrace
 * Toggle: PBAoE, Minor DoT(Cold), Foe -Recharge, -Speed
 *
 * Source: dominator_assault/icy_assault/chilling_embrace.json
 */

import type { Power } from '@/types';

export const ChillingEmbrace: Power = {
  "name": "Chilling Embrace",
  "internalName": "Chilling_Embrace",
  "available": 23,
  "description": "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their damage and movement speed. The low air temperatures may also deal some damage over time to the snared foes.Recharge: Very Fast.",
  "shortHelp": "Toggle: PBAoE, Minor DoT(Cold), Foe -Recharge, -Speed",
  "icon": "iceassault_chillingembrace.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 2,
    "endurance": 0.52,
    "castTime": 0.73,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.14,
    "table": "Melee_Damage"
  },
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.4,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    },
    "damageDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Dam"
    }
  }
};
