/**
 * Subdual
 * Ranged, Moderate DOT(Psionic), Foe Immobilize
 *
 * Source: blaster_support/mental_manipulation/subdual.json
 */

import type { Power } from '@/types';

export const Subdual: Power = {
  "name": "Subdual",
  "internalName": "Subdual",
  "available": 0,
  "description": "Subdual deals moderate Psionic damage and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DOT(Psionic), Foe Immobilize",
  "icon": "mentalcontrol_subdue.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "damageBuff": {
      "scale": 0.11,
      "table": "Ranged_Ones"
    }
  }
};
