/**
 * Subdue
 * Ranged, DMG(Psionic), Foe Immobilize
 *
 * Source: widow_training/fortunata_training/frt_subdue.json
 */

import type { Power } from '@/types';

export const Subdue: Power = {
  "name": "Subdue",
  "available": 1,
  "description": "Subdue deals moderate Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Immobilize",
  "icon": "fortunatatraining_subdue.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Immobilize",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.986,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Psionic",
    "scale": 1.728,
    "table": "Ranged_Damage"
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 6,
      "table": "Ranged_Immobilize"
    }
  }
};
