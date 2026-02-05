/**
 * Titan Sweep
 * Melee (Cone), DMG(Smashing), Foe Knockdown
 *
 * Source: tanker_melee/titan_weapons/sweeping_strike.json
 */

import type { Power } from '@/types';

export const TitanSweep: Power = {
  "name": "Titan Sweep",
  "internalName": "Sweeping_Strike",
  "available": 3,
  "description": "You make a sweeping slash with your weapon, causing high damage and possibly knocking your opponent down.",
  "shortHelp": "Melee (Cone), DMG(Smashing), Foe Knockdown",
  "icon": "titanweapons_sweepingstrike.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 15,
    "radius": 15,
    "arc": 2.0944,
    "recharge": 10,
    "endurance": 10.4988,
    "castTime": 2.43,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
