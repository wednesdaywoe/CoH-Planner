/**
 * Power Shield
 * Toggle: Self +DEF(Fire, Cold, Energy, Negative), Res(DeBuff DEF)
 *
 * Source: tanker_defense/energy_aura/power_shield.json
 */

import type { Power } from '@/types';

export const PowerShield: Power = {
  "name": "Power Shield",
  "internalName": "Power_Shield",
  "available": 1,
  "description": "This Power Shield creates a Electro-Magnetic shield around you that can deflect non-physical attacks. Your Defense to Fire, Cold, Energy and Negative Energy attacks is increased as these attacks are reflected or refracted off the shield. Power Shield also grants you good resistance to Defense Debuffs. Power Shield also adds Psionic Defense and an Elusivity defense bonus to Fire, Cold, Energy and Psionic Attacks in PVP zones.",
  "shortHelp": "Toggle: Self +DEF(Fire, Cold, Energy, Negative), Res(DeBuff DEF)",
  "icon": "energyaura_powershield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 1.67
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
      "energy": {
        "scale": 2,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.4,
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
