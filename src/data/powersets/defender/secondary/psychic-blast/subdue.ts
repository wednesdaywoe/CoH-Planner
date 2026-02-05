/**
 * Subdue
 * Ranged, DMG(Psionic), Foe Immobilize
 *
 * Source: defender_ranged/psychic_blast/subdue.json
 */

import type { Power } from '@/types';

export const Subdue: Power = {
  "name": "Subdue",
  "internalName": "Subdue",
  "available": 0,
  "description": "Subdue deals moderate Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Immobilize",
  "icon": "psychicblast_subdue.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  }
};
