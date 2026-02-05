/**
 * Overload
 * Self +DEF(All), +Recovery, +MaxHP, Res(DeBuff DEF)
 *
 * Source: tanker_defense/energy_aura/overload.json
 */

import type { Power } from '@/types';

export const Overload: Power = {
  "name": "Overload",
  "internalName": "Overload",
  "available": 25,
  "description": "You can Overcharge your Energy Aura and significantly improve your defense to all attack types. Overcharge also grants you Defense Debuffs. This Energy Aura is so powerful, that it can even absorb some damage, effectively increasing your Max Hit Points. Overcharge also adds a moderate Elusivity defense bonus to all attacks in PVP zones.",
  "shortHelp": "Self +DEF(All), +Recovery, +MaxHP, Res(DeBuff DEF)",
  "icon": "energyaura_overload.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "endurance": 10.5,
    "castTime": 3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "smashing": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 2,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Buff_Def"
      }
    },
    "maxHPBuff": {
      "scale": 3,
      "table": "Melee_HealSelf"
    },
    "elusivity": {
      "all": {
        "scale": 1,
        "table": "Melee_Res_Boolean"
      }
    },
    "recoveryBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
