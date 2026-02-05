/**
 * Psychic Scream
 * Ranged (Cone), DMG(Psionic), Foe -Recharge
 *
 * Source: arachnos-widow/night-widow-training
 */

import type { Power } from '@/types';

export const PsychicScream: Power = {
  "name": "Psychic Scream",
  "available": 23,
  "description": "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.",
  "shortHelp": "Ranged (Cone), DMG(Psionic), Foe -Recharge",
  "icon": "nightwidowtraining_psychicscream.png",
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
    "range": 50,
    "recharge": 20,
    "endurance": 21.157,
    "castTime": 2,
    "radius": 50,
    "maxTargets": 12
  },
  "targetType": "Foe (Alive)"
};
