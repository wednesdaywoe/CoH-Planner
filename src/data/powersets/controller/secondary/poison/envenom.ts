/**
 * Envenom
 * Ranged (Targeted AoE), Foe -RES, -DEF, -Regen, -Heal
 *
 * Source: controller_buff/poison/envenom.json
 */

import type { Power } from '@/types';

export const Envenom: Power = {
  "name": "Envenom",
  "internalName": "Envenom",
  "available": 0,
  "description": "You Envenom your foe with a nasty poison, the poison then spreads to nearby foes. The toxin directly attacks the immune system, reducing the affected target's Defense, Damage Resistance and Hit Point Regeneration Rate. The poison is so potent, that the target actually responds less to Healing while affected by the poison. Secondary foes struck by this power will have a lesser effect placed on them while the primary target receives the full effectiveness of the power.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Foe -RES, -DEF, -Regen, -Heal",
  "icon": "poison_envenomaoe.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 8,
    "recharge": 12,
    "endurance": 10.4,
    "castTime": 1.33,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_Def"
    },
    "resistance": {
      "heal": {
        "scale": 1,
        "table": "Ranged_Res_Dmg"
      }
    },
    "regenDebuff": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    },
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
