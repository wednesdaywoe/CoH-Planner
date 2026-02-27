/**
 * Slug
 * Ranged, DMG(Lethal), Foe Knockback
 *
 * Source: mastermind_summon/mercenaries/slug.json
 */

import type { Power } from '@/types';

export const Slug: Power = {
  "name": "Slug",
  "internalName": "Slug",
  "available": 1,
  "description": "Fires a single Slug at a targeted foe. Firing a single Slug is slower than firing a Burst, but deals more damage, is longer range, and can knock down foes.Focus Fire:The target struck by this attack will take 3.33% increased damage from any Mercenary Henchmen regardless of their owners for 30 seconds. This does effect does not stack from the same power or from multiple Masterminds.",
  "shortHelp": "Ranged, DMG(Lethal), Foe Knockback",
  "icon": "paramilitary_assaultrifleslug.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 100,
    "recharge": 8,
    "endurance": 10.66,
    "castTime": 1.67
  },
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
