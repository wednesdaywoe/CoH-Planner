/**
 * Focused Fighting
 * Toggle: Self +DEF(Melee), Res(Confuse, DeBuff DEF)
 *
 * Source: brute_defense/super_reflexes/focused_fighting.json
 */

import type { Power } from '@/types';

export const FocusedFighting: Power = {
  "name": "Focused Fighting",
  "internalName": "Focused_Fighting",
  "available": 0,
  "description": "You become more evasive to melee attacks while you have Focused Fighting activated. This will increase your Defense versus melee as long as it is active. Your Focus also offers you resistance to Confuse effects and DeBuffs to Defense. Focused Fighting also adds an Elusivity defense bonus to Melee Attacks in PVP zones.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Melee), Res(Confuse, DeBuff DEF)",
  "icon": "superreflexes_focusedfighting.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 1.85,
        "table": "Melee_Buff_Def"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
