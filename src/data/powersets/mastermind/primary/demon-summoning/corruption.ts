/**
 * Corruption
 * Ranged, Light DMG(Fire), Foe Minor DoT (Toxic), -Res
 *
 * Source: mastermind_summon/demon_summoning/corruption.json
 */

import type { Power } from '@/types';

export const Corruption: Power = {
  "name": "Corruption",
  "internalName": "Corruption",
  "available": 0,
  "description": "You lash out with your whip, firing a bolt of hellfire and corrupting your victim's very living essence. This attack deals minor fire damage, causes minor toxic damage over time, and reduces their damage resistance for a short time.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Fire), Foe Minor DoT (Toxic), -Res",
  "icon": "demonsummoning_corruption.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 6.5,
    "castTime": 1.23
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.76,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.15,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
