/**
 * Poison Dart
 * Ranged, DMG(Lethal), DoT(Toxic), -Regeneration
 *
 * Source: arachnos-widow/widow-training
 */

import type { Power } from '@/types';

export const PoisonDart: Power = {
  "name": "Poison Dart",
  "available": 0,
  "description": "Poison Dart does moderate damage to your foe, then poisons them. The poison does toxic damage over time and reduces their regeneration rate. ",
  "shortHelp": "Ranged, DMG(Lethal), DoT(Toxic), -Regeneration",
  "icon": "widowtraining_poisondart.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)"
};
