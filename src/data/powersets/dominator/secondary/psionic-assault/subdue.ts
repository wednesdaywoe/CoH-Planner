/**
 * Subdue
 * Ranged, Moderate DMG(Psionic), Foe Immobilize
 *
 * Source: dominator_assault/psionic_assault/subdue.json
 */

import type { Power } from '@/types';

export const Subdue: Power = {
  "name": "Subdue",
  "internalName": "Subdue",
  "available": 23,
  "description": "Subdue deals high Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Ranged, Moderate DMG(Psionic), Foe Immobilize",
  "icon": "psionicassault_subdue.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.64,
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
