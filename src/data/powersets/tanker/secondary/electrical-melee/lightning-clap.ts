/**
 * Lightning Clap
 * PBAoE, Foe Disorient, Knockback
 *
 * Source: tanker_melee/electrical_melee/lightning_clap.json
 */

import type { Power } from '@/types';

export const LightningClap: Power = {
  "name": "Lightning Clap",
  "internalName": "Lightning_Clap",
  "available": 27,
  "description": "You can clap your hands together to release a violent Lightning Clap. The Lightning Clap can knock down most nearby foes, Disorienting many of them. Lightning Clap deals no damage.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
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
    "Stuns",
    "Threat Duration"
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
