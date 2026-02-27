/**
 * Gravity Well
 * Melee, Extreme DMG(Negative), Foe Hold -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/gravity_well.json
 */

import type { Power } from '@/types';

export const GravityWell: Power = {
  "name": "Gravity Well",
  "available": 15,
  "description": "Mastery over the forces of gravity and dark matter allows you to capture a single foe and crush them in a Gravity Well. The target is Held helpless, while he is crushed by the massive gravimetric forces. The target's attack rate and movement speed are also slowed, even if they resists the Hold effect.  Damage: Extreme. Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Negative), Foe Hold -Recharge, -SPD",
  "icon": "umbralblast_gravitywell.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Kheldian Archetype Sets",
    "Melee Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.07
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Negative",
      "scale": 1.56,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.33,
      "table": "Melee_Damage",
      "duration": 2.75,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Melee_Slow"
    }
  }
};
