/**
 * Amp Up
 * Ranged, Ally +Special, +Recharge
 *
 * Source: defender_buff/shock_therapy/amp_up.json
 */

import type { Power } from '@/types';

export const AmpUp: Power = {
  "name": "Amp Up",
  "internalName": "Amp_Up",
  "available": 25,
  "description": "Empower an ally with raw energy, causing all of their abilities to unleash chained bolts of electricity at nearby foes. These bolts drain a small amount of endurance and have a chance to knock up the target. Amp Up also moderately increases their attack rate and greatly boosts the secondary effects of their powers. Their power effects like heals, defense debuffs, endurance drains, disorients, holds, immobilizes and more, are all improved.Recharge: Very Long.",
  "shortHelp": "Ranged, Ally +Special, +Recharge",
  "icon": "shocktherapy_ampup.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 300,
    "endurance": 10.4,
    "castTime": 2.57
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "absorb": {
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "enduranceGain": {
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "movement": {
      "runSpeed": {
        "scale": 6,
        "table": "Ranged_Buff_Dmg"
      },
      "flySpeed": {
        "scale": 6,
        "table": "Ranged_Buff_Dmg"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "effectDuration": 90,
    "fear": {
      "mag": 1,
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "hold": {
      "mag": 1,
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "immobilize": {
      "mag": 1,
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "stun": {
      "mag": 1,
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "sleep": {
      "mag": 1,
      "scale": 6,
      "table": "Ranged_Buff_Dmg"
    },
    "defenseBuff": {
      "scale": 3.6,
      "table": "Ranged_Buff_Dmg"
    },
    "tohitBuff": {
      "scale": 3.6,
      "table": "Ranged_Buff_Dmg"
    }
  }
};
