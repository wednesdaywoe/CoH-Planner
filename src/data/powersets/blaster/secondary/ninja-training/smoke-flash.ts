/**
 * Smoke Flash
 * PBAoE, Foe Placate, -Res
 *
 * Source: blaster_support/ninja_training/smoke_flash.json
 */

import type { Power } from '@/types';

export const SmokeFlash: Power = {
  "name": "Smoke Flash",
  "internalName": "Smoke_Flash",
  "available": 23,
  "description": "You throw a smoke bomb at your feet. The resulting flash of light and smoke can briefly distract your foes and Placate them so they can no longer find or target you. Enemies will be distracted and confused, making them more vulnerable to attacks for a short time.Recharge: Long.",
  "shortHelp": "PBAoE, Foe Placate, -Res",
  "icon": "ninjatools_placate.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 20,
    "recharge": 90,
    "endurance": 2.6,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "placate": {
      "scale": 8,
      "table": "Melee_Taunt"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
