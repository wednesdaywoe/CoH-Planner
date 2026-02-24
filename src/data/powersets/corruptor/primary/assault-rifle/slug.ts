/**
 * Slug
 * Ranged, DMG(Lethal), Foe Knockback
 *
 * Source: corruptor_ranged/assault_rifle/slug.json
 */

import type { Power } from '@/types';

export const Slug: Power = {
  "name": "Slug",
  "internalName": "Slug",
  "available": 0,
  "description": "Fires a single Slug at a targeted foe. Firing a single Slug is slower than firing a Burst, but deals more damage, is longer range, and can knock down foes.",
  "shortHelp": "Ranged, DMG(Lethal), Foe Knockback",
  "icon": "assaultweapons_shotgunslug.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 100,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.4
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.75,
      "table": "Ranged_Knockback"
    }
  }
};
