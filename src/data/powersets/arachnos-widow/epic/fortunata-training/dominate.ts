/**
 * Dominate
 * Ranged, DMG(Psionic), Foe Hold
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const Dominate: Power = {
  "name": "Dominate",
  "available": 11,
  "description": "Painfully tears at the mind of a single foe. Dominate deals Psionic damage and renders a foe helpless, lost in his own mind and unable to defend himself.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Hold",
  "icon": "fortunatatraining_dominate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 7.216,
    "castTime": 1.1
  },
  "targetType": "Foe (Alive)"
};
