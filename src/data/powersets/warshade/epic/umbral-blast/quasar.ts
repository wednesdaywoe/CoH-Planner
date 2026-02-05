/**
 * Quasar
 * PBAoE, Extreme DMG(Negative), Foe -Recharge, -SPD, Knockback
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const Quasar: Power = {
  "name": "Quasar",
  "available": 25,
  "description": "You can explode in a tremendous blast of Negative Energy, sending nearby foes flying. The Quasar deals massive damage to all nearby foes. Affected foes will be knocked down and their attack rate and movement speed will be slowed.  Damage: Extreme. Recharge: Long.",
  "shortHelp": "PBAoE, Extreme DMG(Negative), Foe -Recharge, -SPD, Knockback",
  "icon": "umbralblast_quasar.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.4,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 3,
    "radius": 25,
    "maxTargets": 16
  },
  "targetType": "Self"
};
