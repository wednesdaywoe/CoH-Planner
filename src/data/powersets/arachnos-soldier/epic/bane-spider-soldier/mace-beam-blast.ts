/**
 * Mace Beam Blast
 * Ranged(Targeted AoE), Light DMG(Smash/Energy), Foe Knockback
 */

import type { Power } from '@/types';

export const MaceBeamBlast: Power = {
  "name": "Mace Beam Blast",
  "available": 1,
  "description": "The Nullifier Mace is capable of firing a tremendous bolt of force from the end of it. The Mace Beam Blast is a light damage area of effect attack. Foes struck by the blast may be knocked back. Damage: Light",
  "shortHelp": "Ranged(Targeted AoE), Light DMG(Smash/Energy), Foe Knockback",
  "icon": "banespider_macebeamblast.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 12,
    "endurance": 13,
    "castTime": 1.67,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.4,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.4,
      "table": "Ranged_Damage"
    }
  ]
};
