/**
 * Psionic Dart
 * Ranged, Light DMG(Psionic), Target -Recharge
 *
 * Source: dominator_assault/psionic_assault/psionic_dart.json
 */

import type { Power } from '@/types';

export const PsionicDart: Power = {
  "name": "Psionic Dart",
  "internalName": "Psionic_Dart",
  "available": 0,
  "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.Damage: Light.Recharge: Very Fast.",
  "shortHelp": "Ranged, Light DMG(Psionic), Target -Recharge",
  "icon": "psionicassault_mentaldart.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.84,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
