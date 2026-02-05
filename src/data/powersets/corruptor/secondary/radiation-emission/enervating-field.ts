/**
 * Enervating Field
 * Toggle: Ranged (Targeted AoE), Foe -DMG, -Res
 *
 * Source: corruptor_buff/radiation_emission/enervating_field.json
 */

import type { Power } from '@/types';

export const EnervatingField: Power = {
  "name": "Enervating Field",
  "internalName": "Enervating_Field",
  "available": 9,
  "description": "While this power is active, you irradiate a targeted foe, and all foes nearby, with a deadly dose of radiation. This radiation weakens exposed targets, decreasing the damage of their attacks. It also significantly weakens their resistance, so they will take much more damage from other attacks.Recharge: Moderate.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DMG, -Res",
  "icon": "radiationpoisoning_radiationinfection.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 15,
    "recharge": 8,
    "endurance": 0.26,
    "castTime": 1.5,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Dam"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
