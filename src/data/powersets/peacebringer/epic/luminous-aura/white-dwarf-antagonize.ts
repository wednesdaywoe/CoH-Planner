/**
 * White Dwarf Antagonize
 * Ranged (Targeted AoE), Foe Taunt
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const WhiteDwarfAntagonize: Power = {
  "name": "White Dwarf Antagonize",
  "available": 19,
  "description": "This power attracts the attention of a foe and all those around him. Use this to pull villains off of an ally in trouble. An Accuracy check is required to Taunt enemy players, but is not needed against critter targets.  Recharge: Moderate.",
  "shortHelp": "Ranged (Targeted AoE), Foe Taunt",
  "icon": "luminousaura_antagonize.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Taunt",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "stats": {
    "accuracy": 1.5,
    "range": 60,
    "recharge": 10,
    "castTime": 1.67,
    "radius": 15,
    "maxTargets": 5
  },
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf"
};
