/**
 * Disruption Aura
 * Toggle: PBAoE, Foe -Res(All)
 *
 * Source: dominator_assault/sonic_assault/disruption_aura.json
 */

import type { Power } from '@/types';

export const DisruptionAura: Power = {
  "name": "Disruption Aura",
  "internalName": "Disruption_Aura",
  "available": 23,
  "description": "You emit a constant wave of sonic energy around yourself, weakening the Damage Resistance of all nearby foes.",
  "shortHelp": "Toggle: PBAoE, Foe -Res(All)",
  "icon": "sonicmanipulation_disruptionaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 10,
    "endurance": 1.04,
    "castTime": 1.97,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Debuff_Res_Dmg"
      }
    }
  }
};
