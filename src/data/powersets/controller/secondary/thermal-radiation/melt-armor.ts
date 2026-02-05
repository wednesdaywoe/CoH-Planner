/**
 * Melt Armor
 * Ranged (Targeted AoE), Foe -Res, -DEF
 *
 * Source: controller_buff/thermal_radiation/melt_armor.json
 */

import type { Power } from '@/types';

export const MeltArmor: Power = {
  "name": "Melt Armor",
  "internalName": "Melt_Armor",
  "available": 29,
  "description": "The searing heat from this power is enough to melt the armor and defenses of all targets in the affected area. Melt Armor significantly weakens the Defense and Damage Resistance of the affected targets.",
  "shortHelp": "Ranged (Targeted AoE), Foe -Res, -DEF",
  "icon": "thermalradiation_meltarmor.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 20,
    "recharge": 100,
    "endurance": 18.2,
    "castTime": 1.5,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 3,
        "table": "Ranged_Debuff_Res_Dmg"
      }
    }
  }
};
