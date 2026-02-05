/**
 * Gleam
 * Ranged (Targeted AoE), DMG(Psionic), Foe Disorient
 *
 * Source: dominator_control/illusion_control/gleam.json
 */

import type { Power } from '@/types';

export const Gleam: Power = {
  "name": "Gleam",
  "internalName": "Gleam",
  "available": 11,
  "description": "Multiple flashing lights go off around enemies, disorienting and damaging them. Gleam deals minimal Psionic damage, and can Disorient all affected targets for a good while.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Psionic), Foe Disorient",
  "icon": "illusions_stun.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 25,
    "arc": 1.5708,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.5,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.25,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
