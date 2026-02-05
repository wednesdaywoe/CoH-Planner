/**
 * Sparkling Chain
 * Ranged Chain AoE, Minor DoT(Fire, Energy), Foe Immobilize,Chance for Blast Off
 *
 * Source: dominator_control/pyrotechnic_control/sparkling_field.json
 */

import type { Power } from '@/types';

export const SparklingChain: Power = {
  "name": "Sparkling Chain",
  "internalName": "Sparkling_Field",
  "available": 1,
  "description": "Immobilizes a group of foes one by one in a chain formation, dealing Fire and Energy damage over time to each enemy in the chain. More resilient foes may require multiple casts to Immobilize. Sparkling Chain is slower and less damaging than Sparkling Cage, but can capture multiple targets.This power has a chance of Blasting Off targets into the air. This chance is greater on the initial target of Sparkling Chain.",
  "shortHelp": "Ranged Chain AoE, Minor DoT(Fire, Energy), Foe Immobilize,Chance for Blast Off",
  "icon": "pyrotechnic_sparklingfield.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 15,
    "recharge": 8,
    "endurance": 13,
    "castTime": 1.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
