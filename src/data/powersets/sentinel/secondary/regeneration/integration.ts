/**
 * Integration
 * Toggle: Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize), +Regeneration
 *
 * Source: sentinel_defense/regeneration/integration.json
 */

import type { Power } from '@/types';

export const Integration: Power = {
  "name": "Integration",
  "internalName": "Integration",
  "available": 15,
  "description": "You can Integrate your mind and body, making you resistant to Knockback, Disorient, Hold, Sleep, and Immobilization effects, as well as increase your regeneration rate, for as long as you can keep this toggle power active.",
  "shortHelp": "Toggle: Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize), +Regeneration",
  "icon": "regeneration_integration.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.13,
    "castTime": 3.1
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
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
