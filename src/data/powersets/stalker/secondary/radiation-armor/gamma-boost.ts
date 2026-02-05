/**
 * Gamma Boost
 * Auto: Self +Regen, +Recovery, Special
 *
 * Source: stalker_defense/radiation_armor/gamma_boost.json
 */

import type { Power } from '@/types';

export const GammaBoost: Power = {
  "name": "Gamma Boost",
  "internalName": "Gamma_Boost",
  "available": 3,
  "description": "Gamma Boost grants you a passive boost to both regeneration and recovery. The lower your current health is, the greater the regeneration bonus you'll receive from Gamma Boost. The higher your current health is, the greater the recovery bonus you'll receive from Gamma Boost. This power is always active.",
  "shortHelp": "Auto: Self +Regen, +Recovery, Special",
  "icon": "radiationarmor_gammaboost.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 0.5,
      "table": "Melee_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "enduranceGain": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    }
  }
};
