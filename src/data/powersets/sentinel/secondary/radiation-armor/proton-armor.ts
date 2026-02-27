/**
 * Proton Armor
 * Toggle: Self, +Res(Energy, Fire, Cold and Negative)
 *
 * Source: sentinel_defense/radiation_armor/proton_armor.json
 */

import type { Power } from '@/types';

export const ProtonArmor: Power = {
  "name": "Proton Armor",
  "internalName": "Proton_Armor",
  "available": 3,
  "description": "When active, your body is encased in a shield-like radiation barrier that gives you good resistance to Energy and Fire damage and moderate resistance to Cold and Negative Energy attacks.",
  "shortHelp": "Toggle: Self, +Res(Energy, Fire, Cold and Negative)",
  "icon": "radiationarmor_protonarmor.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "energy": {
        "scale": 4,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
