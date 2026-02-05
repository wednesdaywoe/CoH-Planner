/**
 * Gravimetric Snare
 * Ranged, Moderate DOT(Negative), Foe Immobilize, -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const GravimetricSnare: Power = {
  "name": "Gravimetric Snare",
  "available": 1,
  "description": "You can hurl Gravimetric fibers to Snare your foes. Gravimetric Snare can Immobilize a single target and crush them. The target's attack rate and movement speed are also slowed, even if they resist the Immobilization effect.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DOT(Negative), Foe Immobilize, -Recharge, -SPD",
  "icon": "umbralblast_gravimetricsnare.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Immobilize",
    "Kheldian Archetype Sets",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
