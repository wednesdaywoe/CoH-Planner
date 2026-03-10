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
    }
  }
};
