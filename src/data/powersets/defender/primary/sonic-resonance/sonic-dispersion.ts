/**
 * Sonic Dispersion
 * Toggle: PBAoE, Ally +Res(All DMG except Psionic, Hold, Immobilize, Disorient)
 *
 * Source: defender_buff/sonic_debuff/sonic_dispersion.json
 */

import type { Power } from '@/types';

export const SonicDispersion: Power = {
  "name": "Sonic Dispersion",
  "internalName": "Sonic_Dispersion",
  "available": 11,
  "description": "You create a large field of sonic waves, protecting all allies inside. The Sonic Dispersion gives all allies within increased Resistance against all damage except Psionic. The Sonic Bubble also protects allies from Immobilization, Disorient, and Hold effects.Recharge: Slow.",
  "shortHelp": "Toggle: PBAoE, Ally +Res(All DMG except Psionic, Hold, Immobilize, Disorient)",
  "icon": "sonicdebuff_buffdamageres.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 15,
    "endurance": 1.04,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 20,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 2.25,
    "immobilize": {
      "mag": 1,
      "scale": 20,
      "table": "Ranged_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 20,
      "table": "Ranged_Res_Boolean"
    }
  }
};
