/**
 * Disruption Field
 * Toggle: Ranged (Target Ally AoE), Foe -Res
 *
 * Source: defender_buff/sonic_debuff/disruption_field.json
 */

import type { Power } from '@/types';

export const DisruptionField: Power = {
  "name": "Disruption Field",
  "internalName": "Disruption_Field",
  "available": 7,
  "description": "You set up a constant wave of sonic energy around an ally, weakening the Damage Resistance of all nearby foes.Recharge: Moderate.",
  "shortHelp": "Toggle: Ranged (Target Ally AoE), Foe -Res",
  "icon": "sonicdebuff_teamdebuffdamres.png",
  "powerType": "Toggle",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 15,
    "recharge": 8,
    "endurance": 0.26,
    "castTime": 2.7,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
