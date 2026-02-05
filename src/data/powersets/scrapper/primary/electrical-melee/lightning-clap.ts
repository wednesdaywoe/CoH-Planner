/**
 * Lightning Clap
 * PBAoE, Foe Disorient, Knockback
 *
 * Source: scrapper_melee/electrical_melee/lightning_clap.json
 */

import type { Power } from '@/types';

export const LightningClap: Power = {
  "name": "Lightning Clap",
  "internalName": "Lightning_Clap",
  "available": 21,
  "description": "You can clap your hands together to release a violent Lightning Clap. The Lightning Clap can knock down most nearby foes, Disorienting many of them. Lightning Clap deals no damage.",
  "shortHelp": "PBAoE, Foe Disorient, Knockback",
  "icon": "electricmelee_pbaoestun.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 15,
    "recharge": 30,
    "endurance": 13,
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
    "Scrapper Archetype Sets",
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Melee_Stun"
    },
    "knockback": {
      "scale": 2,
      "table": "Melee_Knockback"
    }
  }
};
