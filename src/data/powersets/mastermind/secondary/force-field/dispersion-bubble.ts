/**
 * Dispersion Bubble
 * Toggle: PBAoE, Team +Res(Hold, Immobilize, Disorient) +DEF(All)
 *
 * Source: mastermind_buff/force_field/dispersion_bubble.json
 */

import type { Power } from '@/types';

export const DispersionBubble: Power = {
  "name": "Dispersion Bubble",
  "internalName": "Dispersion_Bubble",
  "available": 19,
  "description": "Creates a large bubble which protects all allies inside. While active, the Dispersion Bubble gives all allies within increased Defense against all attack types. The Dispersion Bubble also protects allies from Immobilization, Disorient, and Hold effects.Allies will retain bonuses from the bubble for some after leaving the bubble's area.",
  "shortHelp": "Toggle: PBAoE, Team +Res(Hold, Immobilize, Disorient) +DEF(All)",
  "icon": "forcefield_dispersionbubble.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 15,
    "endurance": 1.3,
    "castTime": 1.07,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      },
      "toxic": {
        "scale": 1,
        "table": "Ranged_Buff_Def"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 20,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 15,
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
