/**
 * Shout
 * Ranged, High DMG(Smashing/Energy), Foe -Res(All)
 *
 * Source: sentinel_ranged/sonic_attack/shout.json
 */

import type { Power } from '@/types';

export const Shout: Power = {
  "name": "Shout",
  "internalName": "Shout",
  "available": 5,
  "description": "You blast your foe with a tremendous Shout, damaging them.",
  "shortHelp": "Ranged, High DMG(Smashing/Energy), Foe -Res(All)",
  "icon": "sonicblast_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 11,
    "endurance": 11.024,
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
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.06,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.06,
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
