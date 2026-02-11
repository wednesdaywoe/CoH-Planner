/**
 * Boomerang Slice
 * Ranged (Cone), DMG(Lethal), Foe -DEF, -Res
 *
 * Source: patch notes (mutually exclusive with Slice)
 */

import type { Power } from '@/types';

export const BoomerangSlice: Power = {
  "name": "Boomerang Slice",
  "internalName": "Boomerang_Slice",
  "available": 1,
  "description": "A narrower but longer reaching variant of Slice. You fling your blade in a narrow arc, slicing enemies at range. This power applies a resistance debuff on targets for 15 seconds. After 15 seconds from last use, this power can inflict a Rending Slice on all targets, dealing additional damage over time. Mutually exclusive with Slice.",
  "shortHelp": "Ranged (Cone), DMG(Lethal), Foe -DEF, -Res",
  "icon": "sword_slice.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 30,
    "radius": 30,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.877,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.23,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
      "table": "Melee_Debuff_Def"
    },
    "resistanceDebuff": {
      "scale": 1.2,
      "table": "Melee_Debuff_Res_Dmg"
    }
  }
};
