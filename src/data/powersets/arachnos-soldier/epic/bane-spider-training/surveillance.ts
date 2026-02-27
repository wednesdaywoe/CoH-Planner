/**
 * Surveillance
 * Ranged Foe -DEF, -RES (All)
 *
 * Source: training_gadgets/bane_spider_training/surveillance.json
 */

import type { Power } from '@/types';

export const Surveillance: Power = {
  "name": "Surveillance",
  "available": 23,
  "description": "When this power is activated, you focus your senses to analyze your targets defensive capabilities and discover their weaknesses. By sharing your knowledge of the targets weaknesses with your team mates, you effectively reduce their defense and resistance to damage.",
  "shortHelp": "Ranged Foe -DEF, -RES (All)",
  "icon": "banespidertraining_surveillance.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
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
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 45,
    "endurance": 10.66,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    }
  }
};
