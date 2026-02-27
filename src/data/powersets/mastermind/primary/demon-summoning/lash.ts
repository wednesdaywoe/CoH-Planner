/**
 * Lash
 * Close, Moderate DMG(Fire), Foe -Res, Knockdown, Minor DoT(Toxic)
 *
 * Source: mastermind_summon/demon_summoning/lash.json
 */

import type { Power } from '@/types';

export const Lash: Power = {
  "name": "Lash",
  "internalName": "Lash",
  "available": 1,
  "description": "You channel unholy energies into your whip and Lash out at your foe dealing high fire damage causing toxic damage over time. Lash has longer range than most melee attacks will reduce the target's damage resistance and also has a chance to knockdown your target.",
  "shortHelp": "Close, Moderate DMG(Fire), Foe -Res, Knockdown, Minor DoT(Toxic)",
  "icon": "demonsummoning_lash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 20,
    "recharge": 5,
    "endurance": 7.54,
    "castTime": 1.8
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Toxic",
    "scale": 0.21,
    "table": "Ranged_Damage",
    "duration": 3.1,
    "tickRate": 1
  },
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Ranged_Debuff_Res_Dmg"
      }
    },
    "knockback": {
      "scale": 0.64,
      "table": "Ranged_Knockback"
    }
  }
};
