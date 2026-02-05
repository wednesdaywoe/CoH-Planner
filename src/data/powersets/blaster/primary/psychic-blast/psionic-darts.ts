/**
 * Psionic Darts
 * Ranged, DMG(Psionic), Target -Recharge
 *
 * Source: blaster_ranged/psychic_blast/psionic_dart.json
 */

import type { Power } from '@/types';

export const PsionicDarts: Power = {
  "name": "Psionic Darts",
  "internalName": "Psionic_Dart",
  "available": 5,
  "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed, but has a very fast attack rate.",
  "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
  "icon": "psychicblast_psychicscream.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 0.5236,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1,
    "maxTargets": 10
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
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.8321,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
