/**
 * Gravity Well
 * Melee, Extreme DMG(Negative), Foe Hold -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
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
  "targetType": "Foe (Alive)"
};
