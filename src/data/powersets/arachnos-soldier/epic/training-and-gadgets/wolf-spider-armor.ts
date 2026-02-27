/**
 * Wolf Spider Armor
 * Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)
 *
 * Source: training_gadgets/training_and_gadgets/wolf_spider_armor.json
 */

import type { Power } from '@/types';

export const WolfSpiderArmor: Power = {
  "name": "Wolf Spider Armor",
  "available": 0,
  "description": "Your Wolf Spider Armor provides good protection to Smashing, Lethal and Psionic damage types, as well as offering basic levels of protection to most status effects, including Confuse, Fear, Disorient, Hold, Sleep and Immobilize effects.",
  "shortHelp": "Auto: Self +RES(Smash, Lethal, Psionic, Status Effects)",
  "icon": "trainingandgadgets_wolfspiderarmor.png",
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
      "scale": 2,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "effectDuration": 10.25
  }
};
