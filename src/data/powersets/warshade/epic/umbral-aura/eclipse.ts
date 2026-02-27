/**
 * Eclipse
 * Melee (AoE), Foe -END, - Recovery; Self +End, + Res (All DMG)
 *
 * Source: warshade_defensive/umbral_aura/eclipse.json
 */

import type { Power } from '@/types';

export const Eclipse: Power = {
  "name": "Eclipse",
  "available": 31,
  "description": "The dark Nictus power allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Endurance of all nearby enemies and add to your own. It will also increase your resistance to all damage. The more foes affected, the more Endurance and Damage Resistance you will gain. Affected foes are unable to recover Endurance for a short while.  Recharge: Very Long.",
  "shortHelp": "Melee (AoE), Foe -END, - Recovery; Self +End, + Res (All DMG)",
  "icon": "umbralaura_eclipse.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "endurance": 0.52,
    "castTime": 1.03,
    "radius": 15,
    "maxTargets": 16
  },
  "targetType": "Self",
  "effects": {
    "enduranceDrain": {
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 25,
      "table": "Melee_Ones"
    },
    "resistance": {
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
    }
  }
};
