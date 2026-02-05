/**
 * Venom Grenade
 * Ranged(Targeted AoE), DoT(Toxic), -Res(All)
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const VenomGrenade: Power = {
  "name": "Venom Grenade",
  "available": 11,
  "description": "This poisonous grenade causes toxic damage over time and weakens the resistance of all foes within the area of effect. NOTE: If you take this power you cannot also take the Crab Spider version. Damage: Moderate",
  "shortHelp": "Ranged(Targeted AoE), DoT(Toxic), -Res(All)",
  "icon": "arachnossoldier_venomgrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 24,
    "endurance": 11.856,
    "castTime": 1.67,
    "radius": 20,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)"
};
