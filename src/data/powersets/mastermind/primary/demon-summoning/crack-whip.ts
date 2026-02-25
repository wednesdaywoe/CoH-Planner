/**
 * Crack Whip
 * Short Ranged (Cone), Moderate DMG(Fire), Foe -Res, Knockdown, DoT(Toxic)
 *
 * Source: mastermind_summon/demon_summoning/crack_whip.json
 */

import type { Power } from '@/types';

export const CrackWhip: Power = {
  "name": "Crack Whip",
  "internalName": "Crack_Whip",
  "available": 7,
  "description": "You channel hellfire into your whip and make an impressive sweep causing high fire damage to enemies within a wide cone and also cause some toxic damage over time. Whip Crack has a larger range than most melee cones. Targets that are struck will also have their resistance to damage reduced for a short time, may suffer toxic damage over time and may be knocked down.",
  "shortHelp": "Short Ranged (Cone), Moderate DMG(Fire), Foe -Res, Knockdown, DoT(Toxic)",
  "icon": "demonsummoning_crackwhip.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "arc": 0.5236,
    "recharge": 11,
    "endurance": 13.78,
    "castTime": 2.33,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Toxic",
    "scale": 0.222,
    "table": "Ranged_Damage",
    "duration": 2.1,
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
    }
  }
};
