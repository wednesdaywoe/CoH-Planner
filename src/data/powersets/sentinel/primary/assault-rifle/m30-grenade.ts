/**
 * M30 Grenade
 * Ranged (Targeted AoE), DMG(Fire/Lethal), Foe Knockback
 *
 * Source: sentinel_ranged/assault_rifle/m30_grenade.json
 */

import type { Power } from '@/types';

export const M30Grenade: Power = {
  "name": "M30 Grenade",
  "internalName": "M30_Grenade",
  "available": 11,
  "description": "Launches a Grenade at long range from beneath the barrel of your Assault Rifle. This explosion affects all within the blast radius, and can knock them back.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Fire/Lethal), Foe Knockback",
  "icon": "assaultweapons_arm30grenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "range": 40,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
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
