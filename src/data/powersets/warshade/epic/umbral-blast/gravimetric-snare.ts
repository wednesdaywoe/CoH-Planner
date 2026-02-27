/**
 * Gravimetric Snare
 * Ranged, Moderate DOT(Negative), Foe Immobilize, -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/gravimetric_snare.json
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
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Negative",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    }
  }
};
