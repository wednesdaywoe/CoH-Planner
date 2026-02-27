/**
 * Explosive Arrow
 * Ranged (Targeted AoE), Light DMG(Lethal/Fire), Knockback
 *
 * Source: sentinel_ranged/archery/explosive_arrow.json
 */

import type { Power } from '@/types';

export const ExplosiveArrow: Power = {
  "name": "Explosive Arrow",
  "internalName": "Explosive_Arrow",
  "available": 11,
  "description": "You fire a grenade-tipped arrow at long range. This explosion affects all within the blast radius, and can knock them back.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Light DMG(Lethal/Fire), Knockback",
  "icon": "archery_explodingarrow.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.155,
    "range": 40,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.18,
    "castTime": 1,
    "maxTargets": 10
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
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.45,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.45,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    }
  }
};
