/**
 * Obsidian Shield
 * Toggle: Self +Res(Psionic, Sleep, Hold, Disorient, Fear)
 *
 * Source: scrapper_defense/dark_armor/obsidian_shield.json
 */

import type { Power } from '@/types';

export const ObsidianShield: Power = {
  "name": "Obsidian Shield",
  "internalName": "Obsidian_Shield",
  "available": 9,
  "description": "You can create a special Obsidian Shield that grants good resistance to Psionic damage. With your mind enshrouded in darkness you are protected from Sleep, Fear, Hold and Disorient attacks.Recharge: Fast.",
  "shortHelp": "Toggle: Self +Res(Psionic, Sleep, Hold, Disorient, Fear)",
  "icon": "darkarmor_obsidianshield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "psionic": {
        "scale": 5,
        "table": "Melee_Res_Dmg"
      }
    },
    "fear": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    }
  }
};
