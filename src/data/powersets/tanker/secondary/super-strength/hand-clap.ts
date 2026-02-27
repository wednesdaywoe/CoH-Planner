/**
 * Hand Clap
 * PBAoE, Foe Disorient, Knockback
 *
 * Source: tanker_melee/super_strength/hand_clap.json
 */

import type { Power } from '@/types';

export const HandClap: Power = {
  "name": "Hand Clap",
  "internalName": "Hand_Clap",
  "available": 15,
  "description": "You can clap your hands together with such force that you create a deafening shockwave. This shockwave can knock back nearby foes, and they have a chance to become Disoriented due to the shock to the inner ear. Hand Clap deals no damage.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE, Foe Disorient, Knockback",
  "icon": "superstrength_handclap.png",
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
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Stuns",
    "Threat Duration"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.4871,
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
