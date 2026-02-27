/**
 * Kuji-In Toh
 * Self +Regen, +Recovery, Res(Psionic, Fear)
 *
 * Source: blaster_support/ninja_training/kuji-in_toh.json
 */

import type { Power } from '@/types';

export const KujiInToh: Power = {
  "name": "Kuji-In Toh",
  "internalName": "Kuji-In_Toh",
  "available": 19,
  "description": "Kuji-In Toh invokes the power of Toh, or harmony with the universe. Focusing your inner power, you can make your body regenerate and recover endurance for a while. You also gain resistance to psionic attacks and fear protection.Recharge: Long.",
  "shortHelp": "Self +Regen, +Recovery, Res(Psionic, Fear)",
  "icon": "ninjatools_toh.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 200,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 1.125,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "resistance": {
      "psionic": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "fear": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 210
  }
};
