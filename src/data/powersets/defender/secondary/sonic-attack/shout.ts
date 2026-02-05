/**
 * Shout
 * Ranged, High DMG(Smashing/Energy), Foe -Res(All)
 *
 * Source: defender_ranged/sonic_attack/shout.json
 */

import type { Power } from '@/types';

export const Shout: Power = {
  "name": "Shout",
  "internalName": "Shout",
  "available": 15,
  "description": "You blast your foe with a tremendous Shout, damaging them.",
  "shortHelp": "Ranged, High DMG(Smashing/Energy), Foe -Res(All)",
  "icon": "sonicblast_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.98,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.98,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Ranged_Debuff_Res_Dmg"
      }
    }
  }
};
