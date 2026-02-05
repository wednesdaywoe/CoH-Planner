/**
 * Sonic Siphon
 * Ranged, Foe -Res(All)
 *
 * Source: corruptor_buff/sonic_resonance/sonic_siphon.json
 */

import type { Power } from '@/types';

export const SonicSiphon: Power = {
  "name": "Sonic Siphon",
  "internalName": "Sonic_Siphon",
  "available": 0,
  "description": "By setting up a constant vibration within the body of your foe, you weaken their Damage Resistance. Affected targets will take more damage from successful attacks.Recharge: Slow.",
  "shortHelp": "Ranged, Foe -Res(All)",
  "icon": "sonicdebuff_debuffdamres.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 16,
    "endurance": 8.528,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
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
