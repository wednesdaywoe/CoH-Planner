/**
 * Psychic Wall
 * Toggle: Self +Res(Smash, Lethal, Psionic)
 *
 * Source: sentinel_defense/psionic_armor/psychic_wall.json
 */

import type { Power } from '@/types';

export const PsychicWall: Power = {
  "name": "Psychic Wall",
  "internalName": "Psychic_Wall",
  "available": 0,
  "description": "You focus to create a psychic wall that dampens the smashing, lethal and psionic damage.",
  "shortHelp": "Toggle: Self +Res(Smash, Lethal, Psionic)",
  "icon": "psionicarmor_psychicwall.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
