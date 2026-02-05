/**
 * Dark Detonation
 * Ranged (Targeted AoE), Light DMG(Negative), Foe Knockback, -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const DarkDetonation: Power = {
  "name": "Dark Detonation",
  "available": 11,
  "description": "You hurl a blast of Dark Matter that violently explodes on impact, damaging all foes near the target. All affected targets' have their attack rate and movement speed slowed. Some foes may be knocked down.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Light DMG(Negative), Foe Knockback, -Recharge, -SPD",
  "icon": "umbralblast_darkmatterdetonation.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "radius": 15,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)"
};
