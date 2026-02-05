/**
 * Shadow Blast
 * Ranged, Moderate DMG(Negative), Foe Knockback, -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const ShadowBlast: Power = {
  "name": "Shadow Blast",
  "available": 5,
  "description": "A much more powerful, yet slower version of Shadow Bolt. Shadow Blast sends focused negative Nictus energy at a foe. This attack can knock down foes and will leave the target's attack rate and movement speed slowed.  Damage: Moderate. Recharge: Moderate.",
  "shortHelp": "Ranged, Moderate DMG(Negative), Foe Knockback, -Recharge, -SPD",
  "icon": "umbralblast_shadowblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
