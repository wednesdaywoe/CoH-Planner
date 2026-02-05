/**
 * Overload
 * Self +DEF(All), +Recovery, +Max HP, Res(DeBuff DEF), +Special
 *
 * Source: sentinel_defense/energy_aura/overload.json
 */

import type { Power } from '@/types';

export const Overload: Power = {
  "name": "Overload",
  "internalName": "Overload",
  "available": 29,
  "description": "You can Overload your Energy Aura and dramatically improve your defense to all attack types. Overload also grants you high resistance to Defense Debuffs. This Energy Aura is so powerful, that it can even absorb some damage, effectively increasing your Max Hit Points. However, when Overload wears off, you are left drained of all Endurance and unable to recover Endurance for a while. Overload also adds a moderate Elusivity defense bonus to all attacks in PVP zones.",
  "shortHelp": "Self +DEF(All), +Recovery, +Max HP, Res(DeBuff DEF), +Special",
  "icon": "energyaura_overload.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 1000,
    "endurance": 2.6,
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
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 6,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 4.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 4.5,
        "table": "Melee_Buff_Def"
      }
    },
    "maxHPBuff": {
      "scale": 4,
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
