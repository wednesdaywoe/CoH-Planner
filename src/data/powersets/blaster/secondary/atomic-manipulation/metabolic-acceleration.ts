/**
 * Metabolic Acceleration
 * Toggle: Self +Recharge, +Regeneration, +Recovery, +Resist(Hold, Immobilize, Disorient, Sleep, End Drain)
 *
 * Source: blaster_support/radiation_manipulation/metabolic_acceleration.json
 */

import type { Power } from '@/types';

export const MetabolicAcceleration: Power = {
  "name": "Metabolic Acceleration",
  "internalName": "Metabolic_Acceleration",
  "available": 19,
  "description": "You cloak yourself in a field of radiation that increases your attack speed, Endurance recovery and Regeneration rate. However, only half of this regeneration bonus is enhanceable. Your metabolism is increased so much that you become resistant to effects such as Sleep, Hold, Disorient, Immobilization and Endurance Drain.",
  "shortHelp": "Toggle: Self +Recharge, +Regeneration, +Recovery, +Resist(Hold, Immobilize, Disorient, Sleep, End Drain)",
  "icon": "atomicmanipulation_metabolism.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 1.125,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 1,
      "table": "Melee_Res_Boolean"
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "immobilize": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 1,
      "table": "Melee_Res_Boolean"
    },
    "enduranceGain": {
      "scale": 1,
      "table": "Melee_Res_Boolean"
    }
  }
};
