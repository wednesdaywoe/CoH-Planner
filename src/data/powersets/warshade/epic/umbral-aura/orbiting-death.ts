/**
 * Orbiting Death
 * Toggle: PBAoE Minor DoT(Negative)
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const OrbitingDeath: Power = {
  "name": "Orbiting Death",
  "available": 3,
  "description": "You surround yourself with orbiting particles and dark matter that will continually cause Negative Energy damage to any nearby foes.  Damage: Minor(DoT). Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE Minor DoT(Negative)",
  "icon": "umbralaura_orbitingdeath.png",
  "powerType": "Toggle",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 1.56,
    "castTime": 2.03,
    "radius": 20,
    "maxTargets": 10
  },
  "targetType": "Self"
};
