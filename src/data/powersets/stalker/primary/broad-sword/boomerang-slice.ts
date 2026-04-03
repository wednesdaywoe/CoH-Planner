/**
 * Boomerang Slice
 * Ranged (Cone), DMG(Lethal/DoT), Foe -DEF
 *
 * HC runtime-only power — not in binary data.
 * Mutually exclusive with Slice.
 */

import type { Power } from '@/types';

export const BoomerangSlice: Power = {
  "name": "Boomerang Slice",
  "internalName": "Boomerang_Slice",
  "available": 1,
  "description": "You toss your sword outward in a Boomerang Slice, attacking all enemies in front of you. This attack wounds your opponents, causing them to take minor damage over time and reduces their defense and damage resistance. Every 15 seconds you can perform a more powerful Rending Slice on your main target.",
  "shortHelp": "Ranged (Cone), DMG(Lethal/DoT), Foe -DEF",
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
    "maxTargets": 5
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
    "Ranged AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.23,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1.23,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 1.23,
      "table": "Melee_InherentDamage"
    }
  ],
  "excludes": ["Slice"],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "durations": {
      "defenseDebuff": 15
    },
    "buffDuration": 15
  }
};
