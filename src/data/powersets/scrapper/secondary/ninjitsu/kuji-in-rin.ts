/**
 * Kuji-In Rin
 * Self +SPD, +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Psionics)
 *
 * Source: scrapper_defense/ninjitsu/kuji-in_rin.json
 */

import type { Power } from '@/types';

export const KujiInRin: Power = {
  "name": "Kuji-In Rin",
  "internalName": "Kuji-In_Rin",
  "available": 9,
  "description": "Kuji-In Rin is the strength of mind and body. By focusing your power on this exercise, you gain a resistance to Disorient, Hold, Sleep, Immobilization, Confusion, and fear, as well as resistance to Psionic damage for a few minutes. Your running speed and jumping height are also increased.Recharge: Long.",
  "shortHelp": "Self +SPD, +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Psionics)",
  "icon": "ninjitsu_kujinrin.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 200,
    "endurance": 10.4,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Run Speed",
    "Recharge",
    "Jump"
  ],
  "allowedSetCategories": [
    "Leaping",
    "Leaping & Sprints",
    "Resist Damage",
    "Running",
    "Running & Sprints",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 120,
    "fear": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
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
    },
    "resistance": {
      "psionic": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedRunning"
      },
      "jumpSpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedRunning"
      },
      "jumpHeight": {
        "scale": 0.1,
        "table": "Melee_SpeedRunning"
      }
    }
  }
};
