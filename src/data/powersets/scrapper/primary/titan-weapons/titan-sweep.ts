/**
 * Titan Sweep
 * Melee (Cone), DMG(Smashing), Foe Knockdown
 *
 * Source: scrapper_melee/titan_weapons/sweeping_strike.json
 */

import type { Power } from '@/types';

export const TitanSweep: Power = {
  "name": "Titan Sweep",
  "internalName": "Sweeping_Strike",
  "available": 1,
  "description": "You make a sweeping slash with your weapon, causing high damage and possibly knocking your opponent down.Notes: Titan Sweep is unaffected by Arc changes.",
  "shortHelp": "Melee (Cone), DMG(Smashing), Foe Knockdown",
  "icon": "titanweapons_sweepingstrike.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 10,
    "arc": 2.0944,
    "recharge": 10,
    "endurance": 10.4982,
    "castTime": 2.43,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
