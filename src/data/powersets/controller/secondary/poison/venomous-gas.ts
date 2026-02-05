/**
 * Venomous Gas
 * Toggle: PBAoE, Foe -Res(All), -DMG(All), -Def(All), -To(Hit)
 *
 * Source: controller_buff/poison/venomous_gas.json
 */

import type { Power } from '@/types';

export const VenomousGas: Power = {
  "name": "Venomous Gas",
  "internalName": "Venomous_Gas",
  "available": 29,
  "description": "You surround yourself in a cloud of toxic vapors that significantly weaken any enemies that get near you. Affected foes have their defense, damage resistance, damage and chance to hit reduced moderately.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Foe -Res(All), -DMG(All), -Def(All), -To(Hit)",
  "icon": "poison_venomousgas.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 15,
    "recharge": 8,
    "endurance": 0.26,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Defense Debuff"
  ],
  "allowedSetCategories": [
    "Defense Debuff",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      }
    },
    "damageDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_Dam"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "tohitDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
