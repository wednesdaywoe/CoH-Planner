/**
 * Psychic Wail
 * PBAoE, DMG(Psionic), Foe Disorient -Recharge
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const PsychicWail: Power = {
  "name": "Psychic Wail",
  "available": 27,
  "description": "Psychic Wail is a devastating Psionic attack that wracks the minds of all nearby foes. Those that survive will have a severely reduced attack rate and may be left Disoriented.",
  "shortHelp": "PBAoE, DMG(Psionic), Foe Disorient -Recharge",
  "icon": "fortunatatraining_psychicwail.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.4,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 1.97,
    "radius": 25,
    "maxTargets": 16
  },
  "targetType": "Self"
};
