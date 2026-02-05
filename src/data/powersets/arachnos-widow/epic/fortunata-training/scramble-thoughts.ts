/**
 * Scramble Thoughts
 * Ranged, DoT(Psionic), Foe Disorient
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const ScrambleThoughts: Power = {
  "name": "Scramble Thoughts",
  "available": 17,
  "description": "Painfully scrambles the synapses of a targeted foe, leaving him dramatically Disoriented for a short duration. Over time, the pain will increase causing psionic damage.",
  "shortHelp": "Ranged, DoT(Psionic), Foe Disorient",
  "icon": "fortunatatraining_scramblethoughts.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 16,
    "endurance": 10.4,
    "castTime": 2
  },
  "targetType": "Foe (Alive)"
};
