/**
 * Mace Beam Volley
 * Ranged(Cone), Moderate DMG(Smash/Energy), Foe Knockback
 */

import type { Power } from '@/types';

export const MaceBeamVolley: Power = {
  "name": "Mace Beam Volley",
  "available": 7,
  "description": "The Nullifier Mace can fire a volley of energy at all foes in front of the user. The Mace Beam Volley is a moderate damage area of effect cone attack with a chance to knock foes off their feet. Damage: Moderate",
  "shortHelp": "Ranged(Cone), Moderate DMG(Smash/Energy), Foe Knockback",
  "icon": "banespider_macebeamvolley.png",
  "powerType": "Click",
  "effectArea": "Cone",
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
    "range": 60,
    "recharge": 14,
    "endurance": 14.56,
    "castTime": 2,
    "arc": 60,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.6,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.6,
      "table": "Ranged_Damage"
    }
  ]
};
