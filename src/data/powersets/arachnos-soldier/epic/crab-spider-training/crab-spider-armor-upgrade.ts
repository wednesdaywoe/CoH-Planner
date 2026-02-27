/**
 * Crab Spider Armor Upgrade
 * Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)
 *
 * Source: training_gadgets/crab_spider_training/crab_spider_armor.json
 */

import type { Power } from '@/types';

export const CrabSpiderArmorUpgrade: Power = {
  "name": "Crab Spider Armor Upgrade",
  "available": 0,
  "description": "Your Crab Spider Armor Upgrade improves your protection to Smashing, Lethal and Psionic damage types, as well as increasing your protection against most status effects, including Confuse, Fear, Disorient, Hold, Sleep and Immobilize effects.",
  "shortHelp": "Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)",
  "icon": "crabspidertraining_crabspiderarmor.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 0.3,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.3,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.2,
        "table": "Melee_Res_Dmg"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "effectDuration": 10.25
  }
};
