/**
 * Evasion
 * Toggle: Self +DEF(vs. AoE), Res(DeBuff DEF)
 *
 * Source: scrapper_defense/super_reflexes/evasion.json
 */

import type { Power } from '@/types';

export const Evasion: Power = {
  "name": "Evasion",
  "internalName": "Evasion",
  "available": 27,
  "description": "You are Evasive against area effect and cone shaped attacks. This power increases your Defense versus such attacks as long as it is active. Evasion also helps you resist Defense DeBuffs.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(vs. AoE), Res(DeBuff DEF)",
  "icon": "superreflexes_evasion.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "aoe": {
        "scale": 1.85,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
