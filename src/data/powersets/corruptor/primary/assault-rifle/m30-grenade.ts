/**
 * M30 Grenade
 * Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback
 *
 * Source: corruptor_ranged/assault_rifle/m30_grenade.json
 */

import type { Power } from '@/types';

export const M30Grenade: Power = {
  "name": "M30 Grenade",
  "internalName": "M30_Grenade",
  "available": 5,
  "description": "Launches a Grenade at long range from beneath the barrel of your Assault Rifle. This explosion affects all within the blast radius, and can knock them back.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Lethal/Fire), Knockback",
  "icon": "assaultweapons_arm30grenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "maxTargets": 16
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
    "Corruptor Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
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
