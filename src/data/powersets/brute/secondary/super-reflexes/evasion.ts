/**
 * Evasion
 * Toggle: Self +DEF(vs. AoE), Res(DeBuff DEF)
 *
 * Source: brute_defense/super_reflexes/evasion.json
 */

import type { Power } from '@/types';

export const Evasion: Power = {
  "name": "Evasion",
  "internalName": "Evasion",
  "available": 19,
  "description": "You are Evasive against area effect and cone shaped attacks. This power increases your Defense versus such attacks as long as it is active. Evasion also helps you resist Defense DeBuffs. Evasion also adds an Elusivity defense bonus to AOE Attacks in PVP zones.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(vs. AoE), Res(DeBuff DEF)",
  "icon": "superreflexes_evasion.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 4,
    "endurance": 0.52,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Threat Duration"
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
