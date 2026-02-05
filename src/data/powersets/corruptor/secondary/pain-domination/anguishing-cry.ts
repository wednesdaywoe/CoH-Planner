/**
 * Anguishing Cry
 * PBAoE, Foe -RES(All), -DEF(All)
 *
 * Source: corruptor_buff/pain_domination/anguishing_cry.json
 */

import type { Power } from '@/types';

export const AnguishingCry: Power = {
  "name": "Anguishing Cry",
  "internalName": "Anguishing_Cry",
  "available": 27,
  "description": "You let out an Anguishing Cry causing a great deal of pain in your foes reducing their resistance and defense to damage for a short time.Recharge: Long.",
  "shortHelp": "PBAoE, Foe -RES(All), -DEF(All)",
  "icon": "paindomination_anguishingcry.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 120,
    "endurance": 13,
    "castTime": 1.97,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
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
      "scale": 3,
      "table": "Ranged_Debuff_Def"
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
