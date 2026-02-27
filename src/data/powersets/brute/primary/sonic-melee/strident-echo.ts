/**
 * Strident Echo
 * Melee, DMG(Energy/Smash), Foe -Res(Debuffs), Chance for Hold
 *
 * Source: brute_melee/sonic_melee/strident_echo.json
 */

import type { Power } from '@/types';

export const StridentEcho: Power = {
  "name": "Strident Echo",
  "internalName": "Strident_Echo",
  "available": 0,
  "description": "Strident Echo deals minor damage over time. It has a low chance of causing a migraine, leaving the target shaking in pain and helpless. This power will inflict a strong additional damage over time effect for 25 seconds against Attuned targets.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe -Res(Debuffs), Chance for Hold",
  "icon": "sonicmanipulation_stridentecho.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Holds",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.22,
    "table": "Melee_Damage",
    "duration": 2.1,
    "tickRate": 0.4
  },
  "effects": {
    "elusivity": {
      "all": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      }
    },
    "enduranceDrain": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "tohitDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "slow": {
      "runSpeed": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "flySpeed": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "jumpSpeed": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      }
    },
    "regenDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "recoveryDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "rechargeDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "hold": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Immobilize"
    }
  }
};
