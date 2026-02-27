/**
 * Venom Grenade
 * Ranged(Targeted AoE), DoT(Toxic), -Res(All)
 *
 * Source: arachnos_soldiers/arachnos_soldier/venom_grenade.json
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
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
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
