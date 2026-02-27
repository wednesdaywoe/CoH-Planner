/**
 * Lightning Clap
 * PBAoE, DMG(Energy), Foe Disorient, Knockback
 *
 * Source: scrapper_melee/electrical_melee/lightning_clap.json
 */

import type { Power } from '@/types';

export const LightningClap: Power = {
  "name": "Lightning Clap",
  "internalName": "Lightning_Clap",
  "available": 21,
  "description": "You can clap your hands together to release a violent Lightning Clap. The Lightning Clap can knock down most nearby foes, Disorienting many of them. Lightning Clap deals moderate Energy damage.",
  "shortHelp": "PBAoE, DMG(Energy), Foe Disorient, Knockback",
  "icon": "electricmelee_pbaoestun.png",
  "powerType": "Click",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 15,
    "endurance": 13,
    "castTime": 1.23,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 2.76,
    "table": "Melee_Damage"
  },
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
