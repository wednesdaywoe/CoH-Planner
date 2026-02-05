/**
 * Psychic Wail
 * PBAoE, Superior DMG(Psionic), Foe Disorient -Recharge
 *
 * Source: sentinel_ranged/psychic_blast/psychic_wail.json
 */

import type { Power } from '@/types';

export const PsychicWail: Power = {
  "name": "Psychic Wail",
  "internalName": "Psychic_Wail",
  "available": 25,
  "description": "Psychic Wail is a devastating Psionic attack that wracks the minds of all nearby foes which deals Extreme Psionic damage. Those that survive will have a severely reduced attack rate and may be left Disoriented.Damage: Superior.Recharge: Long.",
  "shortHelp": "PBAoE, Superior DMG(Psionic), Foe Disorient -Recharge",
  "icon": "psychicblast_psychicwail.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.5,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.97,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 2.253,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    },
    "rechargeDebuff": {
      "scale": 0.7,
      "table": "Ranged_Slow"
    }
  }
};
