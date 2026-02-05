/**
 * Hailstones
 * Ranged, DMG(Cold), Chance for Knockdown
 *
 * Source: defender_ranged/storm_blast/hailstones.json
 */

import type { Power } from '@/types';

export const Hailstones: Power = {
  "name": "Hailstones",
  "internalName": "Hailstones",
  "available": 0,
  "description": "You cause the air around the foe to rapidly condense, causing hailstones to crash down, dealing Cold damage. There is a chance that an especially large chunk of hail will form, knocking the target down. While in a Storm Cell, targets are much more likely to get knocked down by large chunks of hail.",
  "shortHelp": "Ranged, DMG(Cold), Chance for Knockdown",
  "icon": "stormblast_hailstones.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 0.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.25,
      "table": "Ranged_Damage",
      "duration": 1,
      "tickRate": 0.3
    }
  ]
};
