/**
 * Corrosive Enzymes
 * Ranged, Foe -Res(All), -DMG(All)
 *
 * Source: mastermind_buff/nature_affinity/corrosive_sap.json
 */

import type { Power } from '@/types';

export const CorrosiveEnzymes: Power = {
  "name": "Corrosive Enzymes",
  "internalName": "Corrosive_Sap",
  "available": 0,
  "description": "You spray a target with toxic, corrosive Enzymes reducing the damage they deal as well as their damage resistance.Recharge: Slow.",
  "shortHelp": "Ranged, Foe -Res(All), -DMG(All)",
  "icon": "natureaffinity_corrosivesap.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 16,
    "endurance": 10.66,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6,
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
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
      }
    },
    "damageDebuff": {
      "scale": 2.5,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
