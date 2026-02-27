/**
 * Ninja Reflexes
 * Toggle: Self +DEF(Melee), Res(DeBuff DEF)
 *
 * Source: sentinel_defense/ninjitsu/ninja_reflexes.json
 */

import type { Power } from '@/types';

export const NinjaReflexes: Power = {
  "name": "Ninja Reflexes",
  "internalName": "Ninja_Reflexes",
  "available": 0,
  "description": "Activating your Ninja Reflexes enables you to be more evasive to melee attacks. This will increase your Defense versus melee as long as it is active. Ninja Reflexes also grants you resistance to Defense DeBuffs.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Melee), Res(DeBuff DEF)",
  "icon": "ninjitsu_ninjareflexes.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 1.53
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
      "melee": {
        "scale": 1.85,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
