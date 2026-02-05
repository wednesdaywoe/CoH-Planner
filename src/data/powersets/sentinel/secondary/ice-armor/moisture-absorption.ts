/**
 * Moisture Absorption
 * Close AoE, Self +End, +DEF(All but Psionics), Res (Slow), Foe -End
 *
 * Source: sentinel_defense/ice_armor/moisture_absorption.json
 */

import type { Power } from '@/types';

export const MoistureAbsorption: Power = {
  "name": "Moisture Absorption",
  "internalName": "Moisture_Absorption",
  "available": 15,
  "description": "Activating this power draws moisture directly from your target and nearby foes, draining their endurance. The moisture adds to your own Endurance as well as Defense to all types of attacks.",
  "shortHelp": "Close AoE, Self +End, +DEF(All but Psionics), Res (Slow), Foe -End",
  "icon": "icearmor_energyabsorption.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 8,
    "recharge": 60,
    "endurance": 13,
    "castTime": 1.93,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceDrain": {
      "scale": 0.35,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 15,
      "table": "Melee_Ones"
    },
    "defenseBuff": {
      "smashing": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.4,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
