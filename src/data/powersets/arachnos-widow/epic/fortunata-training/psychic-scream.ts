/**
 * Psychic Scream
 * Ranged (Cone), DMG(Psionic), Foe -Recharge
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const PsychicScream: Power = {
  "name": "Psychic Scream",
  "available": 7,
  "description": "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.",
  "shortHelp": "Ranged (Cone), DMG(Psionic), Foe -Recharge",
  "icon": "fortunatatraining_psychicscream.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 12,
    "endurance": 13.55,
    "castTime": 2,
    "radius": 60,
    "maxTargets": 12
  },
  "targetType": "Foe (Alive)"
};
