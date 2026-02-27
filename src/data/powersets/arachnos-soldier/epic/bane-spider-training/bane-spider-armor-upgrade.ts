/**
 * Bane Spider Armor Upgrade
 * Auto: Self +Res(All DMG, Status Effects), +HP
 *
 * Source: training_gadgets/bane_spider_training/bane_spider_armor.json
 */

import type { Power } from '@/types';

export const BaneSpiderArmorUpgrade: Power = {
  "name": "Bane Spider Armor Upgrade",
  "available": 0,
  "description": "Your Bane Spider Armor Upgrade improves your overall health, protection to all damage types, as well as increasing your protection against most status effects, including Confuse, Fear, Disorient, Hold, Sleep and Immobilize effects.",
  "shortHelp": "Auto: Self +Res(All DMG, Status Effects), +HP",
  "icon": "banespidertraining_banespiderarmor.png",
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
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.75,
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
    "maxHPBuff": {
      "scale": 2,
      "table": "Melee_HealSelf"
    },
    "effectDuration": 10.25
  }
};
