/**
 * Mace Beam
 * Ranged, Moderate DMG(Smash/Energy), Foe Knockback
 */

import type { Power } from '@/types';

export const MaceBeam: Power = {
  "name": "Mace Beam",
  "available": 0,
  "description": "The Nullifier Mace has several different ranged attack modes. The Mace Beam is a moderate damage single target attack with a chance to knock a foe off their feet. Damage: Moderate",
  "shortHelp": "Ranged, Moderate DMG(Smash/Energy), Foe Knockback",
  "icon": "banespider_macebeam.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.05,
    "range": 70,
    "recharge": 6,
    "endurance": 9.24,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 1.32,
    "table": "Ranged_Damage"
  }
};
