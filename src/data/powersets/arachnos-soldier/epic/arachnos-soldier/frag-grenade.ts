/**
 * Frag Grenade
 * Ranged(Targeted AoE), Moderate DMG (Lethal/Fire), Foe Knockback
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const FragGrenade: Power = {
  "name": "Frag Grenade",
  "available": 17,
  "description": "Launches a Frag Grenade at long range from under the barrel of your rifle. The explosion from this grenade affects all within the blast and can knock them back. Note: If you take this power, you cannot take the Crab Spider version. Damage: Moderate",
  "shortHelp": "Ranged(Targeted AoE), Moderate DMG (Lethal/Fire), Foe Knockback",
  "icon": "arachnossoldier_fraggrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "radius": 10,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)"
};
