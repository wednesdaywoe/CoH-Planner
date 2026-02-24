/**
 * Force of Thunder
 * PBAoE, Foe Disorient, Knockback
 *
 * Source: blaster_support/electricity_manipulation/lightning_field.json
 */

import type { Power } from '@/types';

export const ForceofThunder: Power = {
  "name": "Force of Thunder",
  "internalName": "Lightning_Field",
  "available": 27,
  "description": "You can channel the raw force of a thunderbolt through you knocking enemies back and potentially disorienting them.",
  "shortHelp": "PBAoE, Foe Disorient, Knockback",
  "icon": "electricitymanipulation_lightningclap.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 15,
    "recharge": 30,
    "endurance": 14,
    "castTime": 1.23,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "knockback": {
      "scale": 1,
      "table": "Melee_Knockback"
    },
    "damageBuff": {
      "scale": 0.025,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Melee_Stun"
    }
  }
};
