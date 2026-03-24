/**
 * Integration
 * Toggle: Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize), +Regeneration, Taunt
 *
 * Source: tanker_defense/regeneration/integration.json
 */

import type { Power } from '@/types';

export const Integration: Power = {
  "name": "Integration",
  "internalName": "Integration",
  "available": 7,
  "description": "You can Integrate your mind and body, making you resistant to Knockback, Disorient, Hold, Sleep, and Immobilization effects, as well as increase your regeneration rate, for as long as you can keep this toggle power active. Integration also taunts nearby foes.",
  "shortHelp": "Toggle: Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize), +Regeneration, Taunt",
  "icon": "regeneration_integration.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 10,
    "endurance": 0.52,
    "castTime": 3.1,
    "activatePeriod": 2,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "taunt": {
      "scale": 1,
      "table": "Melee_InherentTaunt"
    },
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "durations": {
      "knockup": 2.25,
      "knockback": 2.25,
      "hold": 2.25,
      "immobilize": 2.25,
      "stun": 2.25,
      "sleep": 2.25,
      "regenBuff": 2.25
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
    "effectDuration": 2.25,
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
    },
    "buffDuration": 2.25
  }
};
