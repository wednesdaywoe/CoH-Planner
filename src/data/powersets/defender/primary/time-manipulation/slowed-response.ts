/**
 * Slowed Response
 * Ranged (Targeted AoE), Foe -Defense, -Resistance
 *
 * Source: defender_buff/time_manipulation/slowed_response.json
 */

import type { Power } from '@/types';

export const SlowedResponse: Power = {
  "name": "Slowed Response",
  "internalName": "Slowed_Response",
  "available": 21,
  "description": "You manipulate time around a targeted foe causing their reflexes to become slowed and sluggish. This causes them to have decreased defense and damage resistance. A target affected by Time Crawl will suffer from a more powerful effect.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Foe -Defense, -Resistance",
  "icon": "timemanipulation_slowedresponse.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.27,
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
    "resistanceDebuff": {
      "smashing": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 3.6,
        "table": "Ranged_Res_Dmg"
      }
    },
    "defenseDebuff": {
      "scale": 2.5,
      "table": "Ranged_Debuff_Def"
    }
  }
};
